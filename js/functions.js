


function calculateForces(){


	var constant = 0;
	var W;
	var cs = 0;
	var laplacianCs = 0;
	var n = [0, 0];
	var tensionForce = [0, 0];
	var jPressure, iPressure;
	// Calculate density
	for(var i = 0; i < particles.length; i++){

    	particles[i].density = 0;	

		for(var j = 0; j < particles.length; j++){

			relativePosition = subtractVectors(particles[i].position, particles[j].position);

			particles[i].density +=  parameters.mass * Wpoly6(relativePosition, parameters.kernelSize);
		
		}
		 
		particles[i].pressure = (particles[i].density - parameters.restDensity) * parameters.gasConstantK;
		 
	}



	// Calculate forces
	for(var i = 0; i < particles.length; i++){

		
		iPressure = particles[i].pressure;
		pressureForce = [0, 0];
		viscosityForce = [0, 0];
		cs = 0;
		n = [0, 0];

		particles[i].sprite.alpha = particles[i].pressure/600;


		for(var j = 0; j < particles.length; j++){

			relativePosition = subtractVectors(particles[i].position, particles[j].position);;
        
	        //Calculate particle j's pressure force on i
	        jPressure = particles[j].pressure;
	        constant = parameters.mass * ((iPressure + jPressure)/(2*particles[j].density));
	        W = gradWspiky(relativePosition, parameters.kernelSize);
	        pressureForce = subtractVectors( pressureForce, multiplyVec( W, constant));


	        //Calculate particle j's viscosity force on i
	        constant = parameters.viscosityConstant * parameters.mass * laplacianWviscosity(relativePosition, parameters.kernelSize) / particles[j].density;
	        viscosityForce = addVectors(viscosityForce, multiplyVec( subtractVectors(particles[j].velocity, particles[i].velocity), constant ));


	        //Calculate "color" for particle j
			cs = cs + parameters.mass * (1 / particles[j].density) * Wpoly6(relativePosition, parameters.kernelSize);

			// Calculate gradient of "color" for particle j
			constant = parameters.mass * (1 / particles[j].density)
			n = addVectors(n,  multiplyVec( gradWpoly6(relativePosition, parameters.kernelSize), constant ));

			// Calculate laplacian of "color" for particle j
			laplacianCs = laplacianCs + parameters.mass * (1 / particles[j].density) * laplacianWpoly6(relativePosition, parameters.kernelSize);


		}

		if (math.norm(n) < parameters.nThreshold){
       		tensionForce = [0, 0];

			particles[i].sprite.scale.x = 0.02;
			particles[i].sprite.scale.y = 0.02;
			particles[i].sprite.tint = 0x333999;
		}else{


			particles[i].sprite.scale.x = 0.04;
			particles[i].sprite.scale.y = 0.04;
			particles[i].sprite.tint = 0x999999;

        	k = - laplacianCs / math.norm(n);
       		tensionForce = multiplyVec(n, parameters.sigma * k);
    	}

		particles[i].force = addVectors( tensionForce, addVectors(viscosityForce, (addVectors(pressureForce, parameters.gravity))));


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

