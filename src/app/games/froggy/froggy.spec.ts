import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Froggy } from './froggy';

describe('Froggy', () => {
  let component: Froggy;
  let fixture: ComponentFixture<Froggy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Froggy],
    }).compileComponents();

    fixture = TestBed.createComponent(Froggy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
