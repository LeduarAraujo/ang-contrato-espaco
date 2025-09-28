import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroTipoContrato } from './cadastro-tipo-contrato';

describe('CadastroTipoContrato', () => {
  let component: CadastroTipoContrato;
  let fixture: ComponentFixture<CadastroTipoContrato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroTipoContrato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroTipoContrato);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
