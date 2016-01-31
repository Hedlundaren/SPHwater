"use strict";

var width = window.innerWidth, height = window.innerHeight;
var canvas = document.getElementById('canvas');
var renderer = PIXI.autoDetectRenderer(width, height, canvas, true, true);
var stage = new PIXI.Container();
var texture = PIXI.Texture.fromImage('images/purple_sprite.png');
var sprite = new PIXI.Sprite(texture);
var particles = [];
for(var i = 0; i < 10; i++){
	
	sprite = new PIXI.Sprite(texture);
	sprite.scale.x = 0.06;
	sprite.scale.y = 0.06;

	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	var particle = {
	  'sprite' : sprite,
	  'position' : [Math.random()*width, Math.random()*height],
	  'velocity' : [0, 0],
	  'density' : 1,
	  'pressure' : 1,
	  'force' : [0, 9.82],
	  'cs' : 0,
	}

	particle.sprite.position.x = particle.position[0];
	particle.sprite.position.y = particle.position[1];

	stage.addChild(particle.sprite);
	particles.push(particle);

}