import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('greeting component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    });
    TestBed.compileComponents();
  });

  it('should have title `app works!`', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.innerHTML).toContain('app works!');
    expect(compiled.querySelector('h1').innerHTML).toContain('app works!');
  }));

  it('should change title to `app really works!`', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.debugElement.componentInstance.title = 'app really works!';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('h1').innerHTML).not.toContain('app works!');
    expect(compiled.querySelector('h1').innerHTML).toContain('app really works!');
  }));
});
