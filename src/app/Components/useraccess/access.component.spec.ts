import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseraccessComponent } from './access.component';

describe('UseraccessComponent', () => {
  let component: UseraccessComponent;
  let fixture: ComponentFixture<UseraccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UseraccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UseraccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
