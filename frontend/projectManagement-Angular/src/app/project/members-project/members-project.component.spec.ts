import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersProjectComponent } from './members-project.component';

describe('MembersProjectComponent', () => {
  let component: MembersProjectComponent;
  let fixture: ComponentFixture<MembersProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
