import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LainKeluarCashComponent } from './lain-keluar-cash.component';

describe('LainKeluarCashComponent', () => {
  let component: LainKeluarCashComponent;
  let fixture: ComponentFixture<LainKeluarCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LainKeluarCashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LainKeluarCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
