boids = [];
const nboids = 100;
const boidSize = 5;

class boid{
  constructor(id){
    this.id = id;
    this.mass = 3;
    this.size = 5;
    this.peso = 3;
    this.maxSpeed = 2;
    this.r = 50;
    this.rSteer = 20;
    this.position = createVector(random(width-this.size), random(height-this.size)); // posizione randomica del boid
    this.velocity = p5.Vector.random2D(); // generazione randomica della velocità del boid
  }
  
  move(){
    this.position.add(this.velocity);
    if (this.position.x > width) this.position.x = 0;
    else if(this.position.x < 0) this.position.x = width;
    
    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0 ) this.position.y = height;
    this.show();
  }
    
  show(){
    let x = this.position.x;
    let y = this.position.y;
    fill(0,0,0);
   
    let r = 7;
    let triangleSize = 7;
    push();
    
    // traslazione triangolo in base alla velocità
    translate(x, y);
    let angle = this.velocity.heading() - PI/2;
    rotate(angle);
    triangle(0,0,triangleSize,0,triangleSize / 2,triangleSize * 1.2);
  
    pop();
  
 
  }
  
}
function setup() {
  createCanvas(600, 600);
  // creo nboids boids
  for (i = 0; i < nboids; i++){
    boids.push(new boid(i));  
  }
}

// funzione che controlla la regola della deviazione
function steer(b){
  let dist;
  let forza = createVector();
 
  for (let i = 0; i < boids.length; i++){
    // effettuo solo il controllo tra boid diversi
    if(b.id != boids[i].id){
      // calcolo distanza tra i due boid
      let dist = p5.Vector.dist(b.position, boids[i].position);
      // se la distanza è inferiore ad un raggio presente nella classe boid, applico la regola
      //if (dist < b.r){
      if(dist < b.rSteer){
        // calcolo la forza tramite la sottrazione tra la posizione del boid attuale e quello dentro al raggio
        let forza = p5.Vector.sub(b.position, boids[i].position);
        // divido la forza per la distanza
        if(dist > 0){
          forza.div(dist);
        }
        // aggiungo la forza alla velocità
        //b.velocity.add(forza.div(5,5))
        /*
        forza.limit(0.5);
        b.velocity.add(forza);
        b.velocity.limit(b.maxSpeed);
        */
        // limito la velocità
        //b.velocity.normalize();
        forza.sub(b.velocity);
        forza.limit(b.maxForce);
        //forza.mult(peso);
        b.velocity.add(forza);
      }        
    }
  }
}

// align rule 
function align(b){
  let count = 0;
  let med = createVector();
  for(let i = 0; i < nboids; i++){
    if(b.id != boids[i].id){
      let dist = p5.Vector.dist(b.position, boids[i].position);
      if (dist < b.r){
        med.add(boids[i].velocity);
        count++;
      }
    }
  }
  if(count != 0) med.div(count,count);
  
  b.velocity.add(med);
  b.velocity.limit(b.maxSpeed);
}


// cohesion rule
function cohesion(b){
    let count = 0;
    let center = createVector(0,0);
    let centerx = 0, centery = 0;
  
  for (let i = 0; i < nboids; i++){
   
    if (b.id != boids[i].id){
      // calcolo distanza 
      let dist = p5.Vector.dist(b.position, boids[i].position);
      if (dist < b.r){
        center.add(boids[i].position);
        count++;
      }
    }
  }
  
  if(count){
    center.div(count); // trovo il punto medio dei boids nel raggio del boid preso in considerazione
    let dist = p5.Vector.dist(b.position, center);
    let forza = p5.Vector.sub(center, b.position);
    // divido la forza per la distanza
    forza.normalize();
    forza.mult(b.maxSpeed);
    forza.sub(b.velocity);
    forza.limit(0.025);
    //forza.div(this.mass);
    // aggiungo la forza alla velocità
    b.velocity.add(forza);
  }
}

function draw() {
  background(220);
   
 // applicazione regole per ogni boid
  for(let i = 0; i < boids.length; i++){
    boids[i].move();
    steer(boids[i]);
    align(boids[i]);
    cohesion(boids[i]);
  }
 
}
