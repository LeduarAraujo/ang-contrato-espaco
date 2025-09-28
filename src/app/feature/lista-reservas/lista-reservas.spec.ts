import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ListaReservas } from './lista-reservas';
import { ReservaService } from '../../services/reserva.service';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';

describe('ListaReservas', () => {
  let component: ListaReservas;
  let fixture: ComponentFixture<ListaReservas>;
  let mockReservaService: jasmine.SpyObj<ReservaService>;
  let mockEspacoService: jasmine.SpyObj<EspacoService>;
  let mockTipoContratoService: jasmine.SpyObj<TipoContratoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const reservaServiceSpy = jasmine.createSpyObj('ReservaService', ['listarReservas']);
    const espacoServiceSpy = jasmine.createSpyObj('EspacoService', ['listarEspacos']);
    const tipoContratoServiceSpy = jasmine.createSpyObj('TipoContratoService', ['listarTiposContrato']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListaReservas],
      providers: [
        { provide: ReservaService, useValue: reservaServiceSpy },
        { provide: EspacoService, useValue: espacoServiceSpy },
        { provide: TipoContratoService, useValue: tipoContratoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaReservas);
    component = fixture.componentInstance;
    mockReservaService = TestBed.inject(ReservaService) as jasmine.SpyObj<ReservaService>;
    mockEspacoService = TestBed.inject(EspacoService) as jasmine.SpyObj<EspacoService>;
    mockTipoContratoService = TestBed.inject(TipoContratoService) as jasmine.SpyObj<TipoContratoService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to cadastro-reserva when registrarReserva is called', () => {
    component.registrarReserva();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cadastro-reserva']);
  });
});
