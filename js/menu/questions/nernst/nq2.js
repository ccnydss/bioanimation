let nq2 = {
  content: `
Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions

<table id='qtable' class='qtable'>
<tbody>
<tr>
<th>[Na]out</th>
<th>[Na]in</th>
<th>[K]out</th>
<th>[K]in</th>
</tr>

<tr>
<th>150</th>
<th>15</th>
<th>5</th>
<th>120</th>
</tr>

<tr>
<th>150</th>
<th>15</th>
<th>7.5</th>
<th>120</th>
</tr>

<tr>
<th>150</th>
<th>15</th>
<th>2.5</th>
<th>120</th>
</tr>
</tbody>
</table>

<p id='qtext2'>
These changes in [K]out concentration are real examples of pathological conditions that can lead to seizures and renal failure.
</p>
`,
type: "multiple",
choices: ["Alpha", "Beta", "Gamma"],
answer: 1
};
