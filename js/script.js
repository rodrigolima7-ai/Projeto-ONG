'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#form-cadastro');
  if (!form) return;
  const cpf = form.querySelector('#cpf');
  const telefone = form.querySelector('#telefone');
  const cep = form.querySelector('#cep');
  const nascimento = form.querySelector('#nascimento');
  const mensagem = form.querySelector('#mensagem');
  const contador = document.querySelector('#contador-mensagem');
  const status = document.querySelector('#status-cadastro');
  const digitos = texto => texto.replace(/\D/g, '');
  const mascara = (elemento, formatar) => {
    elemento.addEventListener('input', () => {
      elemento.value = formatar(digitos(elemento.value));
      elemento.setCustomValidity('');
    });
  };
  mascara(cpf, n => n.slice(0, 11).replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1-$2'));
  mascara(telefone, n => {
    n = n.slice(0, 11);
    if (n.length <= 2) return n ? '(' + n : '';
    if (n.length <= 6) return '(' + n.slice(0, 2) + ') ' + n.slice(2);
    const meio = n.length > 10 ? 7 : 6;
    return '(' + n.slice(0, 2) + ') ' + n.slice(2, meio) + '-' + n.slice(meio);
  });
  mascara(cep, n => n.slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'));
  const cpfValido = valor => {
    const n = digitos(valor);
    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
    for (let pos = 9; pos <= 10; pos++) {
      const soma = [...n.slice(0, pos)].reduce((total, digito, indice) => total + Number(digito) * (pos + 1 - indice), 0);
      const verificador = (soma * 10) % 11;
      if (Number(n[pos]) !== (verificador === 10 ? 0 : verificador)) return false;
    }
    return true;
  };
  cpf.addEventListener('blur', () => cpf.setCustomValidity(cpf.value && !cpfValido(cpf.value) ? 'Informe um CPF válido.' : ''));
  nascimento.max = new Date().toLocaleDateString('en-CA');
  nascimento.addEventListener('change', () => nascimento.setCustomValidity(''));
  const atualizarContador = () => { contador.textContent = `${mensagem.value.length} de 500 caracteres`; };
  mensagem.addEventListener('input', atualizarContador);
  atualizarContador();
  form.addEventListener('input', () => { status.textContent = ''; });
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    cpf.setCustomValidity(cpfValido(cpf.value) ? '' : 'Informe um CPF válido.');
    const hoje = new Date();
    const data = nascimento.value ? new Date(nascimento.value + 'T12:00:00') : null;
    nascimento.setCustomValidity(data && data > hoje ? 'A data de nascimento não pode estar no futuro.' : '');
    if (!form.reportValidity()) {
      status.textContent = 'Verifique os campos destacados antes de continuar.';
      return;
    }
    status.textContent = 'Dados validados com sucesso! Esta é uma demonstração acadêmica: nenhum cadastro foi enviado ou armazenado.';
    status.focus();
  });
  form.addEventListener('reset', () => {
    cpf.setCustomValidity('');
    nascimento.setCustomValidity('');
    status.textContent = '';
    requestAnimationFrame(atualizarContador);
  });
});
