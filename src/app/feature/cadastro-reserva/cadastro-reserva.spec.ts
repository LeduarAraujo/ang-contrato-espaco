import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CadastroReserva } from './cadastro-reserva';
import { ReservaService } from '../../services/reserva.service';
import { EspacoService } from '../../services/espaco.service';

describe('CadastroReserva', () => {
  let component: CadastroReserva;
  let fixture: ComponentFixture<CadastroReserva>;
  let mockReservaService: jasmine.SpyObj<ReservaService>;
  let mockEspacoService: jasmine.SpyObj<EspacoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const reservaServiceSpy = jasmine.createSpyObj('ReservaService', ['criarReserva']);
    const espacoServiceSpy = jasmine.createSpyObj('EspacoService', ['listarEspacos']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CadastroReserva],
      providers: [
        { provide: ReservaService, useValue: reservaServiceSpy },
        { provide: EspacoService, useValue: espacoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroReserva);
    component = fixture.componentInstance;
    mockReservaService = TestBed.inject(ReservaService) as jasmine.SpyObj<ReservaService>;
    mockEspacoService = TestBed.inject(EspacoService) as jasmine.SpyObj<EspacoService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to lista-reservas when cancelar is called', () => {
    component.cancelar();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lista-reservas']);
  });

  it('should format CPF correctly', () => {
    const event = { target: { value: '12345678901' } };
    component.formatarCPF(event);
    expect(component.reserva.cpfCliente).toBe('123.456.789-01');
  });

  it('should format phone correctly', () => {
    const event = { target: { value: '11987654321' } };
    component.formatarTelefone(event);
    expect(component.reserva.telefoneCliente).toBe('(11) 98765-4321');
  });

  it('should set valorRestante to 0 when valorIntegral is true', () => {
    component.reserva.valorRestante = 100;
    component.reserva.valorIntegral = true;
    component.onValorIntegralChange();
    expect(component.reserva.valorRestante).toBe(0);
  });
});
