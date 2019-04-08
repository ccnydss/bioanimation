
QUnit.module("GoldmanEq Tests");

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
      Cl_in = 2,
      Cl_out = 1,
      K_out = 3,
      K_in  = 5;

  var condition = {
    numerator: Pna*Na_out + Pcl*Cl_in + Pk*K_out,
    denominator: Pna*Na_in + Pcl*Cl_out + Pk*K_in
  }

  // NOTE: In the future, we may wish to test the content of chans as well.
  var result = sim.goldman_eq.compute(condition)
  assert.deepEqual(parseFloat(result.toFixed(7)), -0.0121158, "voltage compute is correct");
});
