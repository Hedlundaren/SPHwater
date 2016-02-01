"use strict";





function getGridParticles(cellGrid){
	
	var innerParticles = [];
	var outerParticles = [];

	for (var i = 1; i < n_rows+1; i++) {

		for (var j = 1; j < n_cols+1; j++) {

			innerParticles = cellGrid[i][j];

			L11 = cellGrid[i-1][j-1];
			L21 = cellGrid[i][j-1];
			L31 = cellGrid[i+1][j-1];

			L12 = cellGrid[i-1][j];
			L22 = innerParticles;
			L32 = cellGrid[i+1][j];

			L13 = cellGrid[i-1][j+1];
			L23 = cellGrid[i][j+1];
			L33 = cellGrid[i+1][j+1];

			// Add particles into one array -->
			row1 = L11.concat(L21);
			row1 = row1.concat(L31);

			row2 = L12.concat(L32);
			row2 = row2.concat(L22);

			row3 = L13.concat(L23);
			row3 = row3.concat(L33);

			outerParticles = row1.concat(row2);
			outerParticles = outerParticles.concat(row3);

			calculateForcesGrid(innerParticles, outerParticles, parameters);

		}
	}


}

function calculateForcesGrid(particles, parameters){
	var emptyParticleArray = {
	    'density': 0,
	    'position': [0,0],
	    'velocity': [0,0],
	    'pressure': 0,
	    'force': [0,0],
	    'cs':0
	}

	var cell = {
		'particles': [emptyParticleArray]
	}

	var n_rows = Math.ceil(height/parameters.kernelSize);
	var n_cols = Math.ceil(width/parameters.kernelSize);


	// console.log(n_rows);
	// console.log(n_cols);

	// Create cellGrid
	var cellGrid = new Array(n_rows+2);

	for (var i = 0; i < n_rows+2; i++) {
	  cellGrid[i] = new Array(n_cols+2);
	}

	for (var i = 0; i < n_rows+2; i++) {
	  for (var k = 0; k < n_cols+2; k++) {
		  cellGrid[i][k] = cell;
		}
	}

	//console.log(cellGrid[5][5]);

	
	// Generate cell grid and put each particle in correct cell
	var row, col = 0;
	for(var p = 0; p < particles.length; p++){

		row = Math.ceil(particles[p].position[1] / parameters.kernelSize);
		col = Math.ceil(particles[p].position[0] / parameters.kernelSize);

		//console.log(col);

		cellGrid[ row ][ col ].particles.push(particles[p]);

		 //cellGrid[ row ][ col ].particles(length(cellGrid(row, col).particles) + 1) = particles(i);
		 //console.log(cellGrid[ row ][ col ].particles[cellGrid[ row ][ col ]);
		 
	}

	//console.log(cellGrid[ row ][ col ].particles);


	var centerCellParticles, neighbouringCellsParticles = [];
	var L11, L21, L31, L12, L22, L32, L13, L23, L33, row1, row2, row3 = [];
	//console.log(cellGrid[2][2].particles);
	//console.log(cellGrid[2][2]);

	for(var row = 1; row < n_rows-1; row++){
	   	for(var col = 1; col < n_cols-1; col++){

	       centerCellParticles = cellGrid[row][col].particles;

			L11 = cellGrid[row-1][col-1].particles;
			L21 = cellGrid[row][col-1].particles;
			L31 = cellGrid[row+1][col-1].particles;

			L12 = cellGrid[row-1][col].particles;
			L22 = centerCellParticles;
			L32 = cellGrid[row+1][col].particles;

			L13 = cellGrid[row-1][col+1].particles;
			L23 = cellGrid[row][col+1].particles;
			L33 = cellGrid[row+1][col+1].particles;

			// Add particles into one array -->
			row1 = L11.concat(L21);
			row1 = row1.concat(L31);

			row2 = L12.concat(L32);
			row2 = row2.concat(L22);

			row3 = L13.concat(L23);
			row3 = row3.concat(L33);

			neighbouringCellsParticles = row1.concat(row2);
			neighbouringCellsParticles = neighbouringCellsParticles.concat(row3);

	       
	       calculateCellDensities(centerCellParticles, neighbouringCellsParticles);
		}
	}

}

function calculateCellDensities( centerCellParticles, neighbouringCellsParticles){
	var n_center = centerCellParticles.length;
	var n_neighbouring = neighbouringCellsParticles.length;
	var relativePosition = [];
	// Calculate their densities
	var density = 0;
	for(var i = 0; i < n_center; i++){
	    density = 0;
	    
	    for(var j = 0; j < n_center; j++){
	        relativePosition = centerCellParticles[i].position - centerCellParticles[j].position;
	        density = density + parameters.mass * Wpoly6(relativePosition, parameters.kernelSize);
	    }
	    
	   for(var j = 0; j < n_neighbouring; j++){
	        relativePosition = centerCellParticles[i].position - neighbouringCellsParticles[j].position;
	        density = density + parameters.mass * Wpoly6(relativePosition, parameters.kernelSize);
	    }
	    
	    centerCellParticles[i].density = density;
	}


}



function calculateCellDensities2(){
	

	var density = 0;
	// Calculate density
	for(var i = 0; i < particles.length; i++){
    	density = 0;	

		for(var j = 0; j < particles.length; j++){
			relativePosition = subtractVectors(particles[i].position, particles[j].position);
			density +=  parameters.mass * Wpoly6(relativePosition, parameters.kernelSize);
		}
		 particles[i].density = density;
	}

}


function calculateCellForces(inner, outer, parameters){

	
//console.log(inner.length);
	var constant = 0;
	var W;
	var cs = 0;
	var laplacianCs = 0;
	var n = [0, 0];
	var tensionForce = [0, 0];



	for (var i = 0; i < inner.length; i++) {

		iPressure = (inner[i].density - parameters.restDensity) * parameters.gasConstantK;
		inner[i].pressure = iPressure;
		pressureForce = [0, 0];
		viscosityForce = [0, 0];
		cs = 0;
		n = [0, 0];

		inner[i].sprite.alpha = inner[i].pressure/6000;



		  for (var j = 0; j < outer.length; j++) {


				relativePosition = subtractVectors(inner[i].position, outer[j].position);;
	        
		        //Calculate particle j's pressure force on i
		        jPressure = (outer[j].density - parameters.restDensity) * parameters.gasConstantK;
		        constant = parameters.mass * ((iPressure + jPressure)/(2*outer[j].density));
		        W = gradWspiky(relativePosition, parameters.kernelSize);
		        pressureForce = subtractVectors( pressureForce, multiplyVec( W, constant));


		        //Calculate particle j's viscosity force on i
		        constant = parameters.viscosityConstant * parameters.mass * laplacianWviscosity(relativePosition, parameters.kernelSize) / outer[j].density;
		        viscosityForce = addVectors(viscosityForce, multiplyVec( subtractVectors(outer[j].velocity, inner[i].velocity), constant ));


		        //Calculate "color" for particle j
				cs = cs + parameters.mass * (1 / outer[j].density) * Wpoly6(relativePosition, parameters.kernelSize);

				// Calculate gradient of "color" for particle j
				constant = parameters.mass * (1 / outer[j].density)
				n = addVectors(n,  multiplyVec( gradWpoly6(relativePosition, parameters.kernelSize), constant ));

				// Calculate laplacian of "color" for particle j
				laplacianCs = laplacianCs + parameters.mass * (1 / outer[j].density) * laplacianWpoly6(relativePosition, parameters.kernelSize);


			}

		if (math.norm(n) < parameters.nThreshold){
       		tensionForce = [0, 0];
		}else{
        	k = - laplacianCs / math.norm(n);
       		tensionForce = multiplyVec(n, parameters.sigma * k);
    	}

		inner[i].force = addVectors( tensionForce, addVectors(viscosityForce, (addVectors(pressureForce, parameters.gravity))));



	}

}


