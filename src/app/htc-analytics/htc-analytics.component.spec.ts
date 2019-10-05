import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtcAnalyticsComponent } from './htc-analytics.component';

describe('HtcAnalyticsComponent', () => {
  let component: HtcAnalyticsComponent;
  let fixture: ComponentFixture<HtcAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtcAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtcAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
