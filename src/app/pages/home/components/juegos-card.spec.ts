import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegosCard } from './juegos-card';

describe('JuegosCard', () => {
    let component: JuegosCard;
    let fixture: ComponentFixture<JuegosCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [JuegosCard],
        }).compileComponents();

        fixture = TestBed.createComponent(JuegosCard);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
