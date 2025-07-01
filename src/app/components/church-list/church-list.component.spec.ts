import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchListComponent } from './church-list.component';

describe('ChurchListComponent', () => {
  let component: ChurchListComponent;
  let fixture: ComponentFixture<ChurchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChurchListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChurchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
