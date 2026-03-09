import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTodosComponent } from './my-todos.component';

describe('MyTodosComponent', () => {
  let component: MyTodosComponent;
  let fixture: ComponentFixture<MyTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
