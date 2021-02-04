const Modal = {
  open(){
      // Abrir modal
      // Adicionar a class active ao modal
      document
          .querySelector('.modal-overlay')
          .classList
          .add('active');

  },
  close(){
      // fechar o modal
      // remover a class active do modal
      document
          .querySelector('.modal-overlay')
          .classList
          .remove('active');
  }
};

const Storage = {
  get() {
      return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions) {
      localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
  }
};

const Transaction = {
  // Busca os objetos salvos na DOM
  all: Storage.get(),
  /**
   * Metodo para adicionar uma nova transação quando solicitado atraves do 
   * O método push() adiciona um ou mais elementos ao final de um array e 
   * retorna o novo comprimento desse array.
   */
  add(transaction){
      Transaction.all.push(transaction);
    // chama o metodo reload para mostrar os novos objetos na DOM
      App.reload();
  },
  /**
   * Metodo para remover o indice selecionado de forma que se retire 1 indice
   * por vez através do método splice(), altera o conteúdo de uma lista, 
   * adicionando novos elementos enquanto remove elementos antigos.
   */
  remove(index) {
      Transaction.all.splice(index, 1);
    // chama o metodo reload para mostrar os novos objetos na DOM
      App.reload();
  },
  // Função entradas
  incomes() {
    // adicionar variavel igual a '0'
      let income = 0;
      // buscar todas as transações
      Transaction.all.forEach(transaction => {
        // verificar se as transações são maior que '0'
          if( transaction.amount > 0 ) {
            // somar todas as transações junto com a variavel 
              income += transaction.amount;
          }
      })
      // retornar variavel 
      return income;
  },
  // Função saidas
  expenses() {
      // adicionar variavel igual a '0'
      let expense = 0;
      // buscar todas as transações
      Transaction.all.forEach(transaction => {
        // verificar se as transações são menor que '0'
          if( transaction.amount < 0 ) {
            // somar todas a transações junto com a variavel
              expense += transaction.amount;
          }
      })
      // retornar a variavel
      return expense;
  },
  // Somando todas as entradas e saidas 
  total() {
    // Retornando o resultado de trodas as entradas e saidas e mostrando o saldo
      return Transaction.incomes() + Transaction.expenses();
  }
};

const DOM = {
  // Pega a variavel com o querySelector dentro hash da data-table e dentro do tbody
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
      const tr = document.createElement('tr');
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
      tr.dataset.index = index;
      // seleciona a variavel com a função appendChild e monta a tr
      DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    /** variavel inteligente para verificar a forma como o valor será
    * apresentado, de forma true ou false com condição ternario
    * se amount é maior que '0' se torna income
    * OU
    * se amount é menor que '0' se torna expense  
    */
      const CSSclass = transaction.amount > 0 ? "income" : "expense";

      const amount = Utils.formatCurrency(transaction.amount);

      const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td> 
      <td class="date">${transaction.date}</td>
      <td>
          <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
      </td>
      `

      return html;
  },
  /**
   * Função que seleciona os valores dos objetos e soma eles com suas respectivas
   * condiçoes de entradas - saidas e total e insere nos cards para mostrar os valores
   * totais de cada operação 
   * total de entradas 
   * total de saidas 
   * total de entradas e saidas que por mostra o saldo disponivel
   */
  updateBalance() {
      document
          .getElementById('incomeDisplay')
          // utilizar o metodo utils.formatCurrency para tratar o valor 
          .innerHTML = Utils.formatCurrency(Transaction.incomes());
      document
          .getElementById('expenseDisplay')
          .innerHTML = Utils.formatCurrency(Transaction.expenses());
      document
          .getElementById('totalDisplay')
          .innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransactions() {
      DOM.transactionsContainer.innerHTML = "";
  }
};
// formantando os valores do objeto dentro da variavel const Utils
const Utils = {
  
  formatAmount(value){
      /**
       * O método replace() retorna uma nova string com algumas ou 
       * todas as correspondências de um padrão 
       * substituídas por um determinado caractere (ou caracteres). 
       * O padrão pode ser uma string ou uma RegExp, 
       * e a substituição pode ser uma string ou uma 
       * função a ser chamada para cada correspondência. 
       * Se o padrão for uma string, 
       * apenas a primeira ocorrência será substituída.
       * 
       * pesquisando assim todas as \ invertidas e pontos e virgula
       * de forma global e multiplicando assim por 100 para obter o número. 
       */
      value = Number(value.replace(/\,?\.?/g, "")) * 100; 
      
      return value;
  },

  formatDate(date) {
    /**
     * Função para formatar a data para o padrão Br
     * O método split() divide uma String em uma lista ordenada de substrings, 
     * coloca essas substrings em um array e retorna o array. 
     * A divisão é feita procurando um padrão, 
     * onde o padrão é fornecido como o primeiro parâmetro na chamada do método.
     */
      const splittedDate = date.split("-");
      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
  // Função para formatar os numeros e transformando-os em moeda corrent
  formatCurrency(value) {
    /** 
     * construimos uma variavel signal igualamos ao numero, solicitamos ao valor
     *  da value verificamos se ele é maior que '0', não faremos nada
     * se for menor que '0' faremos a 
     * troca e adicionamos o sinal de negativo junto ao número
     */ 
      const signal = Number(value) < 0 ? "-" : "";
      /**
       * Pegamos o valor e transformamos em string o dado
       * inserimos a função .replace que verifica através dos '\D' maisculo,
       * para buscar qualquer caracter que não seja número. 
       * em seguida colocaremos '/g' para pesquisa global e verificamos em todo o
       * documento e substituilo por caracter vazio.
       */
      value = String(value).replace(/\D/g, "");
      /**
       * Selecionamos a variavél number e dividimos ela por 100 para poder obter
       * as casas decimais dos numeros
       */
      value = Number(value) / 100;
      /**
       * O método toLocaleString() retorna uma string com uma 
       * representação sensível a linguagem deste número.
       * e represnetando em valor de moeda corrente do pais no caso brasileiro
       */
      value = value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
      });
      //Retornando a variavel signal concatenado ela com o valor ou value do objeto
     return signal + value;
  }
};
// Coletando as informações dos dados do formulario
const Form = {
  /**
   * Linkando os inputs e todos os seus componentes com java script para poderem
   * ser utilizados a partir de agora
   */
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  // Trabalhando com os valores dos elemtos htmls do formulario
  getValues() {
      return {
          description: Form.description.value,
          amount: Form.amount.value,
          date: Form.date.value
      };
  },
  // Validando os dados do elemeto e verificando se estão vazios
  validateFields() {
      const { description, amount, date } = Form.getValues();
      
      /**
       * Condição para verificar se os campos do input estão vazios e 
       * trantando com uma mensagem de error caso eles estejam em brancos
       */
      if( description.trim() === "" || 
          amount.trim() === "" || 
          date.trim() === "" ) {
              throw new Error("Por favor, preencha todos os campos");
      }
  },

  formatValues() {
      let { description, amount, date } = Form.getValues();
      
      amount = Utils.formatAmount(amount);

      date = Utils.formatDate(date);

      return {
          description,
          amount,
          date
      };
  },

  clearFields() {
      Form.description.value = "";
      Form.amount.value = "";
      Form.date.value = "";
  },
  //Previnindo o evento padrão do submit do formulario 
  submit(event) {
      event.preventDefault();

      try {
        // Validando os campos do formulario
          Form.validateFields();
          // Formatando os dados do formulario
          const transaction = Form.formatValues();
          Transaction.add(transaction);
          Form.clearFields();
          Modal.close();
      } catch (error) {
          alert(error.message);
      }
  }
};
/**
 * Iniciando a aplicação com o metodo init ao qual ele busca todos os dados dos 
 * objetos e popula a DOM mostrando todos os conteudos do objeto em tela 
 */
const App = {
  init() {
      Transaction.all.forEach(transaction => DOM.addTransaction(transaction));
      // Chamando a função de balanço 
      DOM.updateBalance();
      /**
       *  metodo storageO método setItem() da interface Storage, 
       * quando passado 'chave' e 'valor', 
       * irá adicionar esta chave ao storage, 
       * ou atualizar o valor caso a chave já exista.
       *  */
      Storage.set(Transaction.all);
  },
  reload() {
    // Limando a DOM com o metodo clear para poder carregar todos objetos em tela
    // limpa
      DOM.clearTransactions();
      // chamando aplicação com o metodo init para iniciar o ciclo de carregamento 
      App.init();
  },
};

App.init();