import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to cadastro-espaco', () => {
    component.navegarParaEspacos();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cadastro-espaco']);
  });

  it('should navigate to cadastro-tipo-contrato', () => {
    component.navegarParaTiposContrato();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cadastro-tipo-contrato']);
  });

  it('should navigate to gerar-relatorio', () => {
    component.navegarParaRelatorios();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/gerar-relatorio']);
  });
});
