import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsetcreatorComponent } from './wordsetcreator.component';

describe('WordsetcreatorComponent', () => {
  let component: WordsetcreatorComponent;
  let fixture: ComponentFixture<WordsetcreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsetcreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsetcreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
