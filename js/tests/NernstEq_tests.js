
QUnit.module("NernstEq Tests");

QUnit.test("compute", function(assert) {

  var sim = new Simulator()

  sim.m_settings = {
    temperature: 37 + 273.13,           // 37 is the human body temperature
    gas_constant: 8.314,                // Ideal gas constant
    faraday: 96485.3329                 // Faraday's constant
  };

  var Pna = 0.03,
      Pcl = 0.1,
      Pk  = 1,
      Na_out = 2,
      Na_in  = 1,
      Na_z  = 1,
      Cl_in = 2,
      Cl_out = 1,
      Cl_z = -1,
      K_out = 3,
      K_in  = 5,
      K_z = 1;

  var condition =
   {Xout: Na_out,
    Xin: Na_in,
    z:   Na_z}

  // NOTE: In the future, we may wish to test the content of chans as well.
  var result = sim.nernst_eq.compute('Na',condition)
  assert.deepEqual(parseFloat(result.toFixed(7)), 0.0185233, "Na voltage compute is correct");

  var condition =
   {Xout: Cl_out,
    Xin: Cl_in,
    z:   Cl_z}
  var result = sim.nernst_eq.compute('Cl',condition)
  assert.deepEqual(parseFloat(result.toFixed(7)), 0.0185233, "cl voltage compute is correct");

  var condition =
   {Xout: K_out,
    Xin: K_in,
    z:   K_z}
  var result = sim.nernst_eq.compute('K',condition)
  assert.deepEqual(parseFloat(result.toFixed(7)), -0.0136510, "K voltage compute is correct");

});
