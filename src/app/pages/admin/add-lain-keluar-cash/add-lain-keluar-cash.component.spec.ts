import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLainKeluarCashComponent } from './add-lain-keluar-cash.component';

describe('AddLainKeluarCashComponent', () => {
  let component: AddLainKeluarCashComponent;
  let fixture: ComponentFixture<AddLainKeluarCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLainKeluarCashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLainKeluarCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
