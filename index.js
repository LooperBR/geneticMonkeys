//cria uma função random mais intuitiva
function random(min,max){
  return Math.floor(Math.random()*(max-min))+min
}
//funcao que gera uma lista minuscula aleatória
function generateLetter(){
  let codigo = random(97,123)
  return String.fromCharCode(codigo) 
}

//classe de cada individuo
class Member{
  constructor(target){
    //palavra alvo
    this.target = target
    //letras do individuo
    this.keys = []
    this.fitness = 0
    //inicializa com letras aleatórias
    for(let i=0;i<target.length;i++){
      this.keys[i] = generateLetter()
    }
  }
  //função que define o fitness do individuo
  fitnessFunction(){
    let matches = 0;
    //vê quantas letras estão corretas
    for(let i=0;i<this.target.length;i++){
      if(this.keys[i]==this.target[i]){
        matches++;
      }
    }
    this.fitness = matches / this.target.length
    return matches / this.target.length
  }

  //faz crossover entre esse individuo e um parceiro
  crossover(partner){
    let child = new Member(this.target)
    //define um ponto em que irá dividir o filho entre os dois pais
    let midpoint = random(0,this.target.length)

    for(let i=0;i<this.target.length;i++){
      if(i<midpoint){
        child.keys[i] = this.keys[i]
      }else{
        child.keys[i] = partner.keys[i]
      }
    }
    return child
  }

  //troca algumas letras por letras aleatórias
  mutate(mutationRate){
    for(let i=0;i<this.keys.length;i++){
      if(Math.random()<mutationRate){
        this.keys[i] = generateLetter()
      }
    }
  }
}

//define a classe população
class Population{
  constructor(size,target,nElites,mutationRate,maxGenerations){
    this.size = size
    this.members = []
    this.target = target
    this.nElites = nElites
    this.mutationRate = mutationRate
    this.currentGeneration = 1
    this.maxGenerations = maxGenerations

    //na inicialização
    for(let i=0;i<size;i++){
      this.members.push(new Member(target))
    }
  }
  //printa todos os membros
  printAll(){
    console.log("printando geracao ",this.currentGeneration)
    for(let i=0;i<this.members.length;i++){
      console.log(this.members[i].keys,this.members[i].fitnessFunction())
    }
  }

  //pega os membros com o maior fitness para serem elites e serem garantido que serão enviados para a próxima geração
  getElites(){
    let elites = []
    for(let i=0;i<this.members.length;i++){
      this.members[i].fitnessFunction()
      elites.push(this.members[i])
    }
    elites.sort((a,b)=>{
      return a.fitness-b.fitness
    })
    elites.reverse()
    elites = elites.slice(0,this.nElites)
    return(elites)
  }
  //deixa os membros com maior fitness com maior chance de se reproduzir
  getMatingPool(){
    let matingPool = []

    this.members.forEach((m)=>{
      const f = Math.floor(m.fitnessFunction() * 100) || 1;

      for (let i = 0; i < f; i += 1) {
        matingPool.push(m);
      }
    })

    return matingPool
  }

  //gera uma nova geração
  newGeneration(){
    let elites = this.getElites()
    let matingPool = this.getMatingPool()
    this.members = []
    //console.log(elites)
    //manda os elites para a proxima geração
    for(let i=0;i<elites.length;i++){
      this.members.push(elites[i])
    }
    //console.log('matingPool')
    //console.log(matingPool)
    //para o resto dos membros gera crianças com pais aleatórios puxados da matingPool
    for (let i = 0; i < this.size-elites.length; i += 1) {
      console.log()
      const parentA = matingPool[random(0, matingPool.length)]
      const parentB = matingPool[random(0, matingPool.length)]

      const child = parentA.crossover(parentB)

      child.mutate(this.mutationRate)

      this.members.push(child)
    }
    //amuenta a geração atual
    this.currentGeneration++
  }

  //checa se a população atual tem algum membro que achou a palavra correta
  checkSolution(){
    for(let i=0;i<this.members.length;i++){
      this.members[i].fitnessFunction()
      if(this.members[i].fitness == 1){
        console.log(this.members[i].fitness)
        return true
      }
    }
    return false
  }

  //função que vai gerando novas gerações até achar a solução
  evolve(){
    //quando maxGenerations = 0 quer dizer que vai rodar até achar uma solução
    while(this.currentGeneration<this.maxGenerations || this.maxGenerations==0){
      //printa geração atual
      this.printAll()
      //gera uma geração nova
      this.newGeneration()
      //se tiver algum membro que chegou na solução ele para o loop
      if(this.maxGenerations==0 && this.checkSolution()){
        console.log("achou solucao")
        break
      }
    }
    this.printAll()

  }
}
//gera a população inicial
populacao = new Population(10,'teste',2,0.2,0)
populacao.evolve()