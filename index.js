function random(min,max){
  return Math.floor(Math.random()*(max-min))+min
}

function generateLetter(){
  let codigo = random(97,123)
  return String.fromCharCode(codigo) 
}

// for(let i=0;i<100;i++){
//   console.log(generateLetter());
// }

class Member{
  constructor(target){
    this.target = target
    this.keys = []
    this.fitness = 0

    for(let i=0;i<target.length;i++){
      this.keys[i] = generateLetter()
    }
  }

  fitnessFunction(){
    let matches = 0;
    for(let i=0;i<this.target.length;i++){
      if(this.keys[i]==this.target[i]){
        matches++;
      }
    }
    this.fitness = matches
    return matches
  }

  crossover(partner){
    let child = new Member(this.target)
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

  mutate(mutationRate){
    for(let i=0;i<this.keys.length;i++){
      if(Math.random()<mutationRate){
        this.keys[i] = generateLetter()
      }
    }
  }
}


class Population{
  constructor(size,target,nParents,mutationRate,maxGenerations){
    this.size = size
    this.members = []
    this.target = target
    this.nParents = nParents
    this.mutationRate = mutationRate
    this.currentGeneration = 1
    this.maxGenerations = maxGenerations

    for(let i=0;i<size;i++){
      this.members.push(new Member(target))
    }
  }

  printAll(){
    console.log("printando geracao ",this.currentGeneration)
    for(let i=0;i<this.members.length;i++){
      console.log(this.members[i].keys,this.members[i].fitnessFunction())
    }
  }

  getParents(){
    let parents = []
    for(let i=0;i<this.members.length;i++){
      this.members[i].fitnessFunction()
      parents.push(this.members[i])
    }
    parents.sort((a,b)=>{
      return a.fitness-b.fitness
    })
    parents.reverse()
    parents = parents.slice(0,this.nParents)
    return(parents)
  }

  newGeneration(){
    let parents = this.getParents()
    this.members = []
    //console.log(parents)
    for(let i=0;i<parents.length;i++){
      this.members.push(parents[i])
    }
    let i = 0 

    while(this.members.length<this.size){
      if(i>=parents.length){
        i=0
      }
      for(let j=0;j<parents.length;j++){
        if(j==i){
          continue
        }
        if(this.members.length>=this.size){
          break
        }
        let child = parents[i].crossover(parents[j])
        child.mutate(this.mutationRate)
        this.members.push(child)
      }
      i++
    }
    this.currentGeneration++
  }

  checkSolution(){
    for(let i=0;i<this.members.length;i++){
      this.members[i].fitnessFunction()
      if(this.members[i].fitness == this.target.length){
        return true
      }
    }
    return false
  }

  evolve(){
    while(this.currentGeneration<this.maxGenerations || this.maxGenerations==0){
      this.printAll()
      this.newGeneration()
      if(this.checkSolution()){
        console.log("achou solucao")
        break
      }
    }
    this.printAll()

  }
}

populacao = new Population(10,'teste',2,0.2,0)
populacao.evolve()