


function calculateForces(){




	// Calculate density
	for(var i = 0; i < particles.length; i++){

    	var density = 0;	

		for(var j = 0; j < particles.length; j++){

			relativePosition = particles[i].position - particles[j].position;
			density +=  parameters.mass * Wpoly6(relativePosition, parameters.kernelSize);
		}

		 particles[i].density = density;
	}






	// Calculate forces
	for(var i = 0; i < particles.length; i++){

		iPressure = (particles[i].density - parameters.restDensity) * parameters.gasConstantK;
		pressureForce = [0, 0];

	

		for(var j = 0; j < particles.length; j++){

			relativePosition = particles[i].position - particles[j].position;
        

	        //Calculate particle j's pressure force on i
	        jPressure = (particles[j].density - parameters.restDensity) * parameters.gasConstantK;

	        //pressureForce = subtractVectors( pressureForce, multiplyVec( gradWspiky(relativePosition, parameters.kernelSize), (parameters.mass * ((iPressure + jPressure)/(2*particles[j].density)))));
	        pressureForce = [0, 9.82];

			
		}


		particles[i].force = pressureForce;


	}	

}



function performTimestep(particles, dt){

	for(var k = 0; k < particles.length; k++){
		
		//Update velocity
	    var velocity = particles[k].velocity;
		velocity = addVectors(velocity, multiplyVec(particles[k].force, dt/parameters.mass));

		//Update position
	    var position = particles[k].position;
	    position = addVectors(position, multiplyVec(velocity, dt));


	    //Check boundaries
	    if(particles[k].position[1] > height-wallPadding){
	    	position[1] = height-wallPadding;
	    	velocity[1] = -velocity[1] ;
	    }

	    if(particles[k].position[1] < wallPadding){
	    	position[1] = wallPadding;
	    	velocity[1] = -velocity[1] ;
	    }

	    if(particles[k].position[0] > width-wallPadding){
	    	position[0] = width-wallPadding;
	    	velocity[0] = -velocity[0] ;
	    }

	    if(particles[k].position[0] < wallPadding){
	    	position[0] = wallPadding;
	    	velocity[0] = -velocity[0] ;
	    }

	    particles[k].position = position;
	    particles[k].velocity = velocity;


	    //Update sprite
	    particles[k].sprite.position.x = particles[k].position[0];
	    particles[k].sprite.position.y = particles[k].position[1];
	}
	
}

