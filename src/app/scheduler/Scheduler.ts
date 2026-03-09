import { Deck, Flashcard } from "../models/models";
import seedrandom from "seedrandom";

class Scheduler {
  private deck: Deck;

  private reps: number;

  
  //Upper limit for the number of learning cards that can be fetched in a single session
  private reportLimit = 1000;


  private today: number;

  private lrnCutoff = 0; 

  //The learn ahead limit in seconds
  private static COLLAPSE_TIME = 1200;

  //Maximum number of new cards to introduce per day
  private static NEW_CARDS_PER_DAY = 20; 

  //Maximum number of review cards to show per day
  private static REVIEW_CARDS_PER_DAY = 200;

  //learning steps for NEW cards, in minutes
  private static NEW_STEPS = [1, 10];

  //learning stpes for LAPSED(relearning cards), in minutes
  private static LAPSE_STEPS = [10];

  //maximum interval(in days) for a card after a laps
  //ie when a review card is answered 'AGAIN', its interval gets reduced
  //This constant sets a floor so that interval never drops below 1 day
  private static LAPSE_MIN_IVL = 1;

  //Multiplier applied to the current interval after a lapse
  //Zero means the interval resets to LAPSE_MIN_IVL
  //A value of 0.5 would halve the interval
  private static LAPSE_MULT = 0;

  //Number of lapses before a card is considered a 'leech'
  private static LEECH_FAILS = 8;

  //The initial ease factor assigned to a card when it graduates
  //from NEW -> REVIEW for the first time
  //2500 means the interval will be multiplied by 2.5
  //the next time the user presses 'GOOD'
  private static INITIAL_FACTOR = 2500;

  //The interval(in days) assigned to a card when it graduates from
  //learning after completing all steps ("Good" on the last step)
  private static GRADUATING_IVL = 1;

  //The interval(in days) assigned to a card when it graduates early
  //by pressing EASY during learning
  private static EASY_IVL = 4;

  //Multiplier applied to the interval 
  //When the user presses HARD in a review card
  private static HARD_FACTOR = 1.2;

  //Multiplier applied on top of the ease factor
  //When the user presses EASY on a reivew card
  private static EASY_BONUS = 1.3;

  //Absolute maximum interval in days
  //No card will ever be scheduled further out than this
  private static MAX_IVL = 36500;


  //Constants that control when NEW cards appears in a session
  private static NEW_CARDS_DISTRIBUTE = 0;
  private static NEW_CARDS_LAST       = 1;
  private static NEW_CARDS_FIRST      = 2;

  private newSpread = Scheduler.NEW_CARDS_DISTRIBUTE;

  //Queue of new cards(queue = NEW), sorted by due
  //Due for new cards is the createdDate
  //The size is limited by the perDay constant
  private newQueue: Flashcard[] = [];

  //Queue of learning cards(queue = LEARNING)
  private lrnQueue: Flashcard[] = [];

  //Queue of review cards(queue = REVIEW) that are due today, shuffled
  private revQueue: Flashcard[] = [];

  //Determines how often a new card is inserted between review and learning cards
  private newCardModulus = 0; 


  constructor(deck:Deck) {
    this.deck = deck;
    this.reps = 0; 
    this.today = this.daysSinceCreation();
    this.reset();
  }



  /**
  * Returns how many full days have passed since the parent Deck
  * was created.
  *
  * We implement this:
  *   (currentEpochSeconds − deck.crt) / 86400   (integer division)
  *
  * @returns number of elapsed days (≥ 0).
  */
  private daysSinceCreation(): number {
    const nowSeconds = Math.floor(Date.now()/1000);     // current epoch seconds
    const crt = this.deck.crt;                   // collection creation (epoch s)

    console.log("TODO: verify if the daysSinceCreation works properly");

    // 86400 seconds = 1 day
    return Math.floor((nowSeconds - crt) / 86400);

  }  

  
  //Resets the scheduler's daily state, called by the constructor
  private reset() {
    this.resetLrn();
    //NOTE: resetRev() must be called before resetNew()
    //because resetNew() calls updateNewCardRation() to calculate the cardModulus
    this.resetRev();
    this.resetNew();
  }

  resetNew() {
    this.newQueue = [];
    this.updateNewCardRatio();
  }


  /**
  * Recalculates the learn-ahead cutoff if enough time has passed
  * (or if forced).
  *
  * Logic:
  *   • Compute a candidate cutoff = now + collapseTime (20 min).
  *   • Only apply it if it differs from the current cutoff by more
  *     than 60 seconds, or if `force` is true.
  *   • This avoids recalculating too frequently while still keeping
  *     the window reasonably up-to-date.
  */
  updateLrnCutoff(force: boolean): boolean {
      const nextCutoff = Math.floor(Date.now() / 1000) + Scheduler.COLLAPSE_TIME;
      /* Has the window shifted forward by more than 60 seconds?
      *  OR is it forced, if yes then update the lrnCutoff
      */
      if (nextCutoff - this.lrnCutoff > 60 || force) {
          this.lrnCutoff = nextCutoff;
          return true;
      }
      return false;
  }





  /**
  * Fills the new-card queue if it is empty.
  *
  * Logic (mirrors Anki):
  *   1. If the queue already has cards, return true immediately (no work needed).
  *   2. Otherwise, find all cards in the deck whose queue == NEW.
  *   3. Sort them by {@code due} (which equals the note id for new cards,
  *      so they appear in creation order).
  *   4. Trim to the daily limit: NEW_CARDS_PER_DAY.
  *   5. Return true if there are cards to study, false otherwise.
  *
  * @returns true if the new-card queue is non-empty after filling.
  */
  fillNew(): boolean {
      // Already have cards? Nothing to do.
      if (this.newQueue.length > 0) {
          return true;
      }

      // Daily limit for new cards
      const limit = Scheduler.NEW_CARDS_PER_DAY;

      // Filter: only cards sitting in the NEW queue (queue == 0).
      // Sort:   by due (= note id → creation order).
      // Limit:  take at most `limit` cards.
      this.newQueue = this.deck.flashcards
          .filter(card => card.queue === 'NEW')
          .sort((a, b) => a.crt - b.crt)
          .slice(0, limit);

      return this.newQueue.length > 0;
  }



  /**
  * Determines how often a new card should appear among review cards.
  *
  * When {@code newSpread == NEW_CARDS_DISTRIBUTE}:
  *   ratio = (newCount + revCount) / newCount
  *   If there are review cards, enforce ratio ≥ 2 so that at least
  *   one review card appears between every two new cards.
  */
  private updateNewCardRatio(): void {
      if (this.newSpread === Scheduler.NEW_CARDS_DISTRIBUTE) {
          if (this.newQueue.length > 0) {

              const newCount = this.newQueue.length;

              // NOTE: resetRev() is called before resetNew() which in turn calls this method.
              // Therefore, the review queue has already been populated.
              const revCount = this.revQueue ? this.revQueue.length : 0;

              this.newCardModulus = Math.floor((newCount + revCount) / newCount);

              // If there are review cards, make sure we don't show two
              // new cards in a row — enforce a minimum modulus of 2.
              if (revCount > 0) {
                  this.newCardModulus = Math.max(2, this.newCardModulus);
              }

              return;
          }
      }

      // Default: do not distribute new cards (show them at the end).
      this.newCardModulus = 0;
  }

  private resetLrn() {
    this.updateLrnCutoff(true);
    this.lrnQueue = [];
  }


  /**
  * Fills the learning queue if it is empty.
  *
  * Logic :
  *   1. If the queue already has cards, return true.
  *   2. Compute a cutoff = now + collapseTime (learn-ahead window).
  *   3. Find all cards whose queue == LEARNING  due < cutoff.
  *   4. Sort by id (≈ creation timestamp, so older learning cards first).
  *   4. Sorted by the due date instead(changed from the original implementation)
  *   5. Trim to reportLimit.
  */
  fillLrn(): boolean {
      if (this.lrnQueue.length > 0) {
          return true;
      }

      // How far into the future we're willing to look for learning cards.
      const cutoff = Math.floor(Date.now() / 1000) + Scheduler.COLLAPSE_TIME;

      // ORIGINAL
      // Filter: queue == LEARNING *and* due timestamp hasn't passed the cutoff.
      // Sort:   by card.id (= creation timestamp → FIFO order).
      // Limit:  reportLimit.

      // NEW FIX: sort by due date
      this.lrnQueue = this.deck.flashcards
          .filter(card =>
              card.queue === 'LEARNING' &&
              card.due < cutoff
          )
          .sort((a, b) => a.due - b.due)
          .slice(0, this.reportLimit);

      return this.lrnQueue.length > 0;
  }


  private resetRev() {
    this.revQueue = [];
  }

  
  /**
  * Fills the review queue if it is empty.
  *
  * Logic:
  *   1. If the queue already has cards, return true.
  *   2. Find all cards whose queue == REVIEW **and** due <= today.
  *      (due for review cards is a day-offset relative to the collection's
  *       creation time, so we compare against {@code this.today}.)
  *   3. Sort by due date.
  *   4. Trim to daily limit: min(queueLimit, REVIEW_CARDS_PER_DAY).
  *   5. Shuffle the result using a deterministic seed (= today)
  *      so that the order is randomised but reproducible within the
  *      same day.
  *
  * @returns true if the review queue is non-empty after filling.
  */
  fillRev(): boolean {
      if (this.revQueue.length > 0) {
          return true;
      }

      const limit = Scheduler.REVIEW_CARDS_PER_DAY;

      // Filter: queue == REVIEW and due day has arrived (due <= today).
      // Sort:   by due (so oldest-due cards are picked first).
      // Limit:  daily cap.
      this.revQueue = this.deck.flashcards
          .filter(card =>
              card.queue === 'REVIEW' &&
              card.due <= this.today
          )
          .sort((a, b) => a.due - b.due)
          .slice(0, limit);

    //TODO: fix this, i did npm install seedrandom
      if (this.revQueue.length > 0) {
          // Shuffle with a seed = today so the order is random but
          // consistent within the same day (restarting the app doesn't
          // re-shuffle).
      const rng = seedrandom(String(this.today));

      this.revQueue.sort(() => rng() - 0.5);

      return true;
      }

      return false;
  }

}











/*

  fields that need to be imported from the database:

  1. NEW_CARDS_PER_DAY
  2. REVIEW_CARDS_PER_DAY

*/

/*

  constants that need to be enforced in the backend as well:


*/
