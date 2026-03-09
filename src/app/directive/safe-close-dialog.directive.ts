import { Directive, ElementRef,  HostListener,  input,    OnDestroy,  OnInit,  } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appSafeCloseDialog]',
  standalone: true,
})
export class SafeCloseDialog implements OnInit, OnDestroy {
  customSaveForm = input.required<()=> void>();
  customRestoreForm = input.required<()=> void>();

  constructor(private dialogElementRef: ElementRef<HTMLDialogElement>, private router: Router) {}

  @HostListener('document:keydown.escape', ['$event'])
  onKeydown(event: Event) {
      this.closeDialog();
  }

  // Close when clicking outside the dialog content
  @HostListener('click', ['$event'])
  onDialogClick(event: MouseEvent) {
    const dlg = this.dialogElementRef.nativeElement;
    if (event.target === dlg && dlg.open) {
        this.closeDialog();
    }
  }

  closeDialog() {
    const dialog = this.dialogElementRef?.nativeElement;
    this.customSaveForm()!();
    dialog.close();
    console.log(this.router.url);
      this.router.navigate(['/home']);
  }

  ngOnInit(): void {
    this.customRestoreForm()();
  }

  ngOnDestroy() {
    console.log("DEBUG:  safe-close-dialog-custom destroyed");
  }
}
