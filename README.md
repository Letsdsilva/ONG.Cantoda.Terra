# ONG Canto da Terra — projeto acadêmico

Site responsivo desenvolvido com HTML, CSS e JavaScript.

## Arquivos
- `index.html`: estrutura e conteúdo.
- `style.css`: identidade visual e adaptação para celular.
- `javascript.js`: menu responsivo, abertura dos formulários, validações e consulta de CEP pela API ViaCEP.

## Organização do site
- Apresentação da Canto da Terra e sua localização geral no Parque Peruche, Zona Norte de São Paulo.
- Descrição da organização e de sua proposta multidisciplinar.
- Frentes do projeto: proteção animal, adoção responsável e pontos comunitários de água e alimentação.
- 21 perfis demonstrativos de cães e gatos para adoção (fotos em `img/`), exibidos em um carrossel de fotos: o visitante escolhe cachorro ou gato e passa os animais.
- Painel IoT simulado (protótipo Arduino Uno no Tinkercad, alerta em ≤20%; ESP8266 previsto), com 4 pontos de água e ração em locais fictícios, e clima pela API Open-Meteo.
- Formulários demonstrativos para animais perdidos, animais encontrados/em situação de abandono, interesse em adoção, consulta e castração.
- Proposta de pontos de água e alimentação, apresentada como iniciativa acadêmica, não como estrutura já implantada.
- Integrantes do grupo.
- Formulário de contato com consulta de CEP pela API pública ViaCEP.

## Validações
Nomes de pessoas e de animais exigem mais de 2 caracteres. O formulário de contato fica visível na seção Contato, com consulta de CEP (ViaCEP).

## Observações
Os formulários são demonstrativos: validam os campos e exibem uma confirmação na interface, mas não enviam nem armazenam dados. A consulta de CEP é feita pela API pública ViaCEP e precisa de conexão com a internet. Os horários de preferência não representam disponibilidade confirmada. As informações sobre animais e perfis são exemplos para apresentação do projeto e devem ser atualizadas pelo grupo conforme os dados reais.

Abra `index.html` em um navegador para visualizar o site.

## Divisão da equipe
Lays: documentação e IoT · Letícia: HTML, CSS e documentação · Carlos: HTML, CSS e documentação · Kaio: CSS e documentação · Luís: CSS e documentação · Bryan: JavaScript e API · Matheus: IoT, API e vídeo · Madson: vídeo, API, banner e avatares.
