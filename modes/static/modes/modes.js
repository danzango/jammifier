var piemenu = new wheelnav('piemenu');
piemenu.clockwise = false;
piemenu.sliceInitPathFunction = piemenu.slicePathFunction;
piemenu.initPercent = 0.1;
piemenu.wheelRadius = piemenu.wheelRadius * 0.83;
piemenu.createWheel();