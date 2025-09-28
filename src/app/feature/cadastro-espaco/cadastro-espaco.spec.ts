import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEspaco } from './cadastro-espaco';

describe('CadastroEspaco', () => {
  let component: CadastroEspaco;
  let fixture: ComponentFixture<CadastroEspaco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroEspaco]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroEspaco);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
