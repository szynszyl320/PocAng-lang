import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordlistsComponent } from './wordlists.component';

describe('WordlistsComponent', () => {
  let component: WordlistsComponent;
  let fixture: ComponentFixture<WordlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordlistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
