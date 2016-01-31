
function performTimestep(particles, dt){

	var velocity = [];
	var position = [];

	for(var k = 0; k < particles.length; k++){
		
		//Update velocity
	    velocity = particles[k].velocity;
		velocity = addVectors(velocity, multiplyVec(particles[k].force, dt/parameters.mass));

		//Update position
	    position = particles[k].position;
	    position = addVectors(position, multiplyVec(velocity, dt));


	    //Check boundaries
	    if(particles[k].position[1] > height-wallPadding){
	    	position[1] = height-wallPadding;
	    	velocity[1] = - parameters.wallDamper * velocity[1];
	    }

	    if(particles[k].position[1] < wallPadding){
	    	position[1] = wallPadding;
	    	velocity[1] = - parameters.wallDamper * velocity[1] ;
	    }

	    if(particles[k].position[0] > width-wallPadding){
	    	position[0] = width-wallPadding;
	    	velocity[0] = - parameters.wallDamper * velocity[0];
	    }

	    if(particles[k].position[0] < wallPadding){
	    	position[0] = wallPadding;
	    	velocity[0] = - parameters.wallDamper * velocity[0];
	    }

	    particles[k].position = position;
	    particles[k].velocity = velocity;


	    //Update sprite
	    particles[k].sprite.position.x = particles[k].position[0];
	    particles[k].sprite.position.y = particles[k].position[1];
	}
	
}

