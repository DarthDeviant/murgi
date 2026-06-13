/* patch.js — CEE Prep Hub formula sheet injection
   Adds a full Physics / Chemistry / Math formula section
   to the existing page after the #difficulty section.
   ──────────────────────────────────────────────────── */

(function () {

  /* ── 1. NAV LINK ─────────────────────────────────────────────────── */
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="#formulas">Formulas</a>';
    navLinks.appendChild(li);
  }

  /* ── 2. DATA ─────────────────────────────────────────────────────── */
  const MATH_DATA = [
    { title: 'Quadratic Equations', formulas: [
      { label: 'Roots', val: 'x = (−b ± √(b²−4ac)) / 2a', imp: 'vvimp' },
      { label: 'Sum of roots', val: 'α + β = −b/a', imp: 'imp' },
      { label: 'Product of roots', val: 'αβ = c/a', imp: 'imp' },
      { label: 'Discriminant', val: 'D = b²−4ac  (D>0 real; D=0 equal; D<0 complex)' },
      { label: 'Equation from roots', val: 'x² − (α+β)x + αβ = 0' },
    ]},
    { title: 'Progressions (AP / GP / HP)', formulas: [
      { label: 'AP: nth term', val: 'aₙ = a + (n−1)d', imp: 'vvimp' },
      { label: 'AP: sum', val: 'Sₙ = n/2 · [2a + (n−1)d]', imp: 'vvimp' },
      { label: 'GP: nth term', val: 'aₙ = arⁿ⁻¹', imp: 'vvimp' },
      { label: 'GP: sum (r≠1)', val: 'Sₙ = a(rⁿ−1)/(r−1)', imp: 'imp' },
      { label: 'GP: S∞  |r|<1', val: 'S∞ = a/(1−r)', imp: 'imp' },
      { label: 'AM ≥ GM ≥ HM', val: 'A=(a+b)/2,  G=√(ab),  H=2ab/(a+b);  G²=AH' },
      { label: 'Σn', val: 'n(n+1)/2', imp: 'imp' },
      { label: 'Σn²', val: 'n(n+1)(2n+1)/6', imp: 'imp' },
      { label: 'Σn³', val: '[n(n+1)/2]²' },
    ]},
    { title: 'Binomial Theorem', formulas: [
      { label: 'Expansion', val: '(a+b)ⁿ = Σ C(n,r)·aⁿ⁻ʳ·bʳ  [r=0→n]', imp: 'vvimp' },
      { label: 'General term', val: 'T(r+1) = C(n,r)·aⁿ⁻ʳ·bʳ', imp: 'vvimp' },
      { label: 'Middle (n even)', val: 'T(n/2 + 1)', imp: 'imp' },
      { label: 'Middle (n odd)', val: 'T((n+1)/2)  and  T((n+3)/2)', imp: 'imp' },
      { label: 'Sum of coefficients', val: 'Put a=b=1 → 2ⁿ' },
      { label: 'C₀+C₂+C₄+…', val: '= 2ⁿ⁻¹' },
      { label: 'C₀²+C₁²+…+Cₙ²', val: '= C(2n,n)' },
      { label: 'Pascal\'s rule', val: 'C(n,r) + C(n,r−1) = C(n+1,r)' },
    ]},
    { title: 'Complex Numbers', formulas: [
      { label: 'Euler form', val: 'e^(iθ) = cosθ + i sinθ', imp: 'vvimp' },
      { label: 'Modulus', val: '|z| = √(a²+b²)' },
      { label: 'Argument', val: 'arg(z) = tan⁻¹(b/a)' },
      { label: 'De Moivre', val: '(cosθ + i sinθ)ⁿ = cos(nθ) + i sin(nθ)', imp: 'vvimp' },
      { label: 'Cube roots ω', val: '1 + ω + ω² = 0,  ω³ = 1', imp: 'imp' },
    ]},
    { title: 'Matrices & Determinants', formulas: [
      { label: '2×2 det', val: 'ad − bc', imp: 'vvimp' },
      { label: 'Inverse (2×2)', val: 'A⁻¹ = (1/det A)·adj(A)' },
      { label: 'Properties', val: 'det(AB)=det(A)·det(B);  det(Aᵀ)=det(A)' },
      { label: 'Cramer\'s rule', val: 'x = Dₓ/D,  y = Dᵧ/D', imp: 'imp' },
    ]},
    { title: 'Trigonometry', formulas: [
      { label: 'sin²θ + cos²θ', val: '= 1', imp: 'vvimp' },
      { label: '1 + tan²θ', val: '= sec²θ' },
      { label: 'sin(A±B)', val: 'sinA cosB ± cosA sinB', imp: 'vvimp' },
      { label: 'cos(A±B)', val: 'cosA cosB ∓ sinA sinB', imp: 'vvimp' },
      { label: 'sin 2θ', val: '2sinθcosθ', imp: 'imp' },
      { label: 'cos 2θ', val: '1−2sin²θ = 2cos²θ−1 = cos²θ−sin²θ', imp: 'imp' },
      { label: 'sin 3θ', val: '3sinθ − 4sin³θ' },
      { label: 'cos 3θ', val: '4cos³θ − 3cosθ' },
      { label: 'sinC + sinD', val: '2 sin((C+D)/2) cos((C−D)/2)' },
      { label: 'Sine rule', val: 'a/sinA = b/sinB = c/sinC = 2R', imp: 'imp' },
      { label: 'Cosine rule', val: 'cos A = (b²+c²−a²)/2bc', imp: 'imp' },
    ]},
    { title: 'Calculus — Limits & Derivatives', formulas: [
      { label: 'lim sinx/x', val: '= 1  (x→0)', imp: 'vvimp' },
      { label: 'lim (1+1/n)ⁿ', val: '= e', imp: 'vvimp' },
      { label: 'd/dx(xⁿ)', val: 'nxⁿ⁻¹', imp: 'vvimp' },
      { label: 'd/dx(sinx)', val: 'cosx' },
      { label: 'd/dx(cosx)', val: '−sinx' },
      { label: 'd/dx(tanx)', val: 'sec²x' },
      { label: 'd/dx(eˣ)', val: 'eˣ' },
      { label: 'd/dx(ln x)', val: '1/x' },
      { label: 'Chain rule', val: '[f(g(x))]\' = f\'(g(x))·g\'(x)', imp: 'vvimp' },
      { label: 'Product rule', val: '(uv)\' = u\'v + uv\'' },
      { label: 'Quotient rule', val: '(u/v)\' = (u\'v − uv\')/v²' },
      { label: 'L\'Hôpital', val: '0/0 or ∞/∞ → d(num)/d(den)', imp: 'imp' },
    ]},
    { title: 'Calculus — Integration', formulas: [
      { label: '∫xⁿ dx', val: 'xⁿ⁺¹/(n+1) + C', imp: 'vvimp' },
      { label: '∫eˣ dx', val: 'eˣ + C' },
      { label: '∫(1/x) dx', val: 'ln|x| + C' },
      { label: '∫sinx dx', val: '−cosx + C' },
      { label: '∫cosx dx', val: 'sinx + C' },
      { label: '∫sec²x dx', val: 'tanx + C' },
      { label: '∫1/(1+x²) dx', val: 'tan⁻¹x + C', imp: 'imp' },
      { label: 'By parts (ILATE)', val: '∫u·v dx = u·∫v dx − ∫[u\'·∫v dx] dx', imp: 'vvimp' },
      { label: 'Newton-Leibniz', val: '∫ᵃᵇ f(x)dx = F(b) − F(a)', imp: 'vvimp' },
    ]},
    { title: 'Coordinate Geometry', formulas: [
      { label: 'Distance', val: '√((x₂−x₁)²+(y₂−y₁)²)', imp: 'vvimp' },
      { label: 'Section formula', val: '((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))', imp: 'imp' },
      { label: 'Point-to-line dist.', val: '|ax₁+by₁+c|/√(a²+b²)', imp: 'vvimp' },
      { label: 'Circle', val: '(x−h)²+(y−k)² = r²', imp: 'vvimp' },
      { label: 'Parabola y²=4ax', val: 'Focus (a,0),  Directrix x=−a', imp: 'imp' },
      { label: 'Ellipse x²/a²+y²/b²=1', val: 'e = √(1−b²/a²),  a>b', imp: 'imp' },
    ]},
    { title: 'Vectors & 3D Geometry', formulas: [
      { label: 'Dot product', val: 'a·b = |a||b|cosθ', imp: 'vvimp' },
      { label: 'Cross product', val: '|a×b| = |a||b|sinθ', imp: 'vvimp' },
      { label: 'Scalar triple', val: '[a b c] = a·(b×c) = 0 if coplanar', imp: 'imp' },
      { label: 'Line (symmetric)', val: '(x−x₁)/l = (y−y₁)/m = (z−z₁)/n' },
      { label: 'Plane', val: 'ax+by+cz+d=0;  normal = (a,b,c)' },
    ]},
    { title: 'Probability', formulas: [
      { label: 'P(A∪B)', val: 'P(A)+P(B)−P(A∩B)', imp: 'vvimp' },
      { label: 'Conditional P(A|B)', val: 'P(A∩B)/P(B)', imp: 'vvimp' },
      { label: 'Bayes theorem', val: 'P(A|B) = P(B|A)P(A)/P(B)', imp: 'imp' },
      { label: 'Binomial dist. P(X=r)', val: 'C(n,r)·pʳ·(1−p)ⁿ⁻ʳ', imp: 'imp' },
      { label: 'Mean / Variance', val: 'np  /  np(1−p)' },
    ]},
  ];

  const PHY_DATA = [
    { title: 'Kinematics', formulas: [
      { label: 'v = u + at', val: '1st equation of motion', imp: 'vvimp' },
      { label: 's = ut + ½at²', val: '2nd equation of motion', imp: 'vvimp' },
      { label: 'v² = u² + 2as', val: '3rd equation of motion', imp: 'vvimp' },
      { label: 'Projectile range', val: 'R = u²sin2θ/g', imp: 'imp' },
      { label: 'Max height', val: 'H = u²sin²θ/2g' },
      { label: 'Time of flight', val: 'T = 2usinθ/g' },
    ]},
    { title: 'Laws of Motion', formulas: [
      { label: 'Newton\'s 2nd law', val: 'F = ma', imp: 'vvimp' },
      { label: 'Impulse', val: 'J = FΔt = Δp', imp: 'imp' },
      { label: 'Friction', val: 'f = μN', imp: 'vvimp' },
      { label: 'Banked road (no friction)', val: 'tanθ = v²/rg', imp: 'imp' },
    ]},
    { title: 'Work, Energy & Power', formulas: [
      { label: 'Work', val: 'W = Fd cosθ', imp: 'vvimp' },
      { label: 'KE', val: '½mv²', imp: 'vvimp' },
      { label: 'PE (spring)', val: '½kx²', imp: 'imp' },
      { label: 'Work-energy theorem', val: 'W_net = ΔKE', imp: 'vvimp' },
      { label: 'Power', val: 'P = W/t = Fv cosθ', imp: 'imp' },
    ]},
    { title: 'Rotational Motion', formulas: [
      { label: 'Torque', val: 'τ = r×F = Iα', imp: 'vvimp' },
      { label: 'Angular momentum', val: 'L = Iω', imp: 'vvimp' },
      { label: 'MI: solid sphere', val: '2mr²/5' },
      { label: 'MI: solid disc', val: 'mr²/2', imp: 'imp' },
      { label: 'MI: rod (centre)', val: 'ml²/12' },
      { label: 'Parallel axis', val: 'I = I_cm + md²', imp: 'vvimp' },
      { label: 'Rolling KE', val: '½mv²(1 + I/mr²)', imp: 'imp' },
    ]},
    { title: 'Gravitation', formulas: [
      { label: 'Newton\'s gravity', val: 'F = Gm₁m₂/r²', imp: 'vvimp' },
      { label: 'Orbital velocity', val: 'v₀ = √(GM/r)', imp: 'vvimp' },
      { label: 'Escape velocity', val: 'v_e = √(2GM/R)', imp: 'vvimp' },
      { label: 'Kepler\'s 3rd law', val: 'T² ∝ r³', imp: 'imp' },
      { label: 'g at height h', val: 'g_h ≈ g(1−2h/R)  for h<<R', imp: 'imp' },
    ]},
    { title: 'Thermodynamics', formulas: [
      { label: 'First law', val: 'ΔU = Q − W', imp: 'vvimp' },
      { label: 'Ideal gas law', val: 'PV = nRT', imp: 'vvimp' },
      { label: 'Adiabatic', val: 'PVᵞ = const,  TV^(γ−1) = const', imp: 'imp' },
      { label: 'Carnot efficiency', val: 'η = 1 − T_L/T_H', imp: 'vvimp' },
      { label: 'RMS speed', val: 'v_rms = √(3RT/M)', imp: 'imp' },
    ]},
    { title: 'Electrostatics', formulas: [
      { label: 'Coulomb\'s law', val: 'F = kq₁q₂/r²  (k = 9×10⁹)', imp: 'vvimp' },
      { label: 'Electric field', val: 'E = kq/r²', imp: 'vvimp' },
      { label: 'Potential', val: 'V = kq/r', imp: 'imp' },
      { label: 'Capacitor energy', val: 'U = ½CV²', imp: 'vvimp' },
      { label: 'Series capacitors', val: '1/C = 1/C₁ + 1/C₂ + …', imp: 'imp' },
      { label: 'Parallel capacitors', val: 'C = C₁ + C₂ + …', imp: 'imp' },
      { label: 'Gauss\'s law', val: 'Φ = Q_enc/ε₀', imp: 'vvimp' },
    ]},
    { title: 'Current Electricity', formulas: [
      { label: 'Ohm\'s law', val: 'V = IR', imp: 'vvimp' },
      { label: 'Resistivity', val: 'R = ρl/A', imp: 'imp' },
      { label: 'Power', val: 'P = VI = I²R = V²/R', imp: 'vvimp' },
      { label: 'KVL', val: 'ΣV = 0  (closed loop)', imp: 'vvimp' },
      { label: 'KCL', val: 'ΣI_in = ΣI_out  (node)', imp: 'vvimp' },
      { label: 'Wheatstone bridge', val: 'P/Q = R/S  (balanced)', imp: 'imp' },
    ]},
    { title: 'Magnetism & EMI', formulas: [
      { label: 'B at centre of loop', val: 'B = μ₀I/2r', imp: 'imp' },
      { label: 'Solenoid', val: 'B = μ₀nI', imp: 'vvimp' },
      { label: 'Ampere\'s law', val: '∮B·dl = μ₀I_enc', imp: 'imp' },
      { label: 'Lorentz force', val: 'F = q(v×B)', imp: 'vvimp' },
      { label: 'Faraday\'s law', val: 'ε = −dΦ/dt', imp: 'vvimp' },
      { label: 'Inductor voltage', val: 'V = −L·dI/dt', imp: 'imp' },
      { label: 'Inductor energy', val: 'U = ½LI²' },
    ]},
    { title: 'Optics', formulas: [
      { label: 'Snell\'s law', val: 'n₁sinθ₁ = n₂sinθ₂', imp: 'vvimp' },
      { label: 'Mirror formula', val: '1/f = 1/v + 1/u', imp: 'vvimp' },
      { label: 'Lens maker\'s eq.', val: '1/f = (n−1)(1/R₁ − 1/R₂)', imp: 'imp' },
      { label: 'Magnification', val: 'm = −v/u', imp: 'imp' },
      { label: 'Young\'s DSE fringe', val: 'β = λD/d', imp: 'vvimp' },
    ]},
    { title: 'Modern Physics', formulas: [
      { label: 'Photoelectric', val: 'KE_max = hν − φ', imp: 'vvimp' },
      { label: 'de Broglie', val: 'λ = h/p = h/mv', imp: 'vvimp' },
      { label: 'H atom energy', val: 'Eₙ = −13.6/n² eV', imp: 'vvimp' },
      { label: 'Bohr radius', val: 'rₙ = 0.529 n²/Z  Å', imp: 'imp' },
      { label: 'Radioactive decay', val: 'N = N₀ e^(−λt)', imp: 'vvimp' },
      { label: 'Half-life', val: 't½ = 0.693/λ', imp: 'vvimp' },
      { label: 'Uncertainty', val: 'Δx·Δp ≥ h/4π', imp: 'imp' },
    ]},
    { title: 'Simple Harmonic Motion', formulas: [
      { label: 'Displacement', val: 'x = A sin(ωt + φ)', imp: 'vvimp' },
      { label: 'Velocity', val: 'v = ω√(A²−x²)', imp: 'imp' },
      { label: 'Spring T', val: 'T = 2π√(m/k)', imp: 'vvimp' },
      { label: 'Pendulum T', val: 'T = 2π√(L/g)', imp: 'vvimp' },
      { label: 'Total energy', val: 'E = ½mω²A²  (constant)', imp: 'imp' },
    ]},
  ];

  const CHEM_DATA = [
    { title: 'Mole Concept', formulas: [
      { label: 'Moles', val: 'n = mass/M = N/Nₐ = V/22.4 (STP)', imp: 'vvimp' },
      { label: 'Molarity', val: 'mol solute / L solution', imp: 'vvimp' },
      { label: 'Molality', val: 'mol solute / kg solvent', imp: 'imp' },
      { label: 'N₁V₁ = N₂V₂', val: 'Normality × Volume conservation', imp: 'vvimp' },
      { label: 'Normality', val: 'Molarity × n-factor', imp: 'imp' },
    ]},
    { title: 'Atomic Structure', formulas: [
      { label: 'Bohr energy', val: 'Eₙ = −13.6 Z²/n²  eV', imp: 'vvimp' },
      { label: 'Bohr radius', val: 'rₙ = 0.529 n²/Z  Å', imp: 'vvimp' },
      { label: 'Rydberg formula', val: '1/λ = R·Z²(1/n₁²−1/n₂²)', imp: 'vvimp' },
      { label: 'de Broglie (e⁻)', val: 'λ = h/mv', imp: 'imp' },
      { label: 'Aufbau order', val: '1s 2s 2p 3s 3p 4s 3d 4p 5s 4d…', imp: 'imp' },
    ]},
    { title: 'Thermodynamics (Chemical)', formulas: [
      { label: 'Gibbs free energy', val: 'ΔG = ΔH − TΔS', imp: 'vvimp' },
      { label: 'Spontaneous', val: 'ΔG < 0', imp: 'vvimp' },
      { label: 'Hess\'s law', val: 'ΔH_rxn = ΣΔHf(products) − ΣΔHf(reactants)', imp: 'vvimp' },
      { label: 'ΔG° & K', val: 'ΔG° = −RT ln K', imp: 'vvimp' },
    ]},
    { title: 'Chemical Kinetics', formulas: [
      { label: 'Rate law', val: 'r = k[A]ᵐ[B]ⁿ', imp: 'vvimp' },
      { label: 'Arrhenius', val: 'k = A·e^(−Eₐ/RT)', imp: 'vvimp' },
      { label: 'ln(k₂/k₁)', val: '(Eₐ/R)(1/T₁ − 1/T₂)', imp: 'vvimp' },
      { label: '1st order t½', val: '0.693/k', imp: 'vvimp' },
      { label: '0th order t½', val: '[A]₀/2k' },
    ]},
    { title: 'Electrochemistry', formulas: [
      { label: 'Nernst equation', val: 'E = E° − (0.0592/n)·log Q  (298 K)', imp: 'vvimp' },
      { label: 'Faraday\'s 1st law', val: 'm = (M/nF)·Q', imp: 'vvimp' },
      { label: 'Cell potential', val: 'E_cell = E_cathode − E_anode', imp: 'vvimp' },
      { label: 'ΔG & E', val: 'ΔG = −nFE', imp: 'vvimp' },
      { label: 'Kohlrausch law', val: 'Λ°m = Σλ°(ions)', imp: 'imp' },
    ]},
    { title: 'Equilibrium', formulas: [
      { label: 'Kp & Kc', val: 'Kp = Kc(RT)^Δn', imp: 'vvimp' },
      { label: 'Henderson-Hasselbalch', val: 'pH = pKa + log([A⁻]/[HA])', imp: 'vvimp' },
      { label: 'pH + pOH', val: '= 14  (298 K)', imp: 'vvimp' },
      { label: 'Weak acid pH', val: 'pH = ½(pKa − log C)', imp: 'imp' },
    ]},
    { title: 'Solutions & Colligative', formulas: [
      { label: 'Raoult\'s law', val: 'p = p°·X_solvent', imp: 'vvimp' },
      { label: 'ΔT_b', val: 'K_b·m', imp: 'vvimp' },
      { label: 'ΔT_f', val: 'K_f·m', imp: 'vvimp' },
      { label: 'Osmotic pressure', val: 'π = MRT', imp: 'vvimp' },
      { label: 'van\'t Hoff factor i', val: 'obs. colligative / expected colligative', imp: 'imp' },
    ]},
    { title: 'Periodic Table Trends', formulas: [
      { label: 'Ionisation energy', val: 'Increases → (period),  Decreases ↓ (group)', imp: 'imp' },
      { label: 'Atomic radius', val: 'Decreases → (period),  Increases ↓ (group)', imp: 'imp' },
      { label: 'Electronegativity', val: 'F > O > N > Cl > Br', imp: 'vvimp' },
      { label: 'Electron affinity', val: 'Cl > F > Br > O  (Cl highest)', imp: 'imp' },
    ]},
    { title: 'Organic — Named Reactions', formulas: [
      { label: 'Aldol condensation', val: 'β-hydroxy carbonyl → α,β-unsaturated (base)', imp: 'imp' },
      { label: 'Cannizzaro', val: 'Aldehyde without α-H disproportionates (NaOH)', imp: 'imp' },
      { label: 'Sandmeyer', val: 'ArN₂⁺ + CuCl/CuBr → ArCl/ArBr', imp: 'imp' },
      { label: 'Reimer-Tiemann', val: 'Phenol + CHCl₃/KOH → salicylaldehyde', imp: 'imp' },
      { label: 'Hofmann bromamide', val: 'RCONH₂ + Br₂/KOH → RNH₂', imp: 'imp' },
      { label: 'Saytzeff rule', val: 'Elimination → more substituted alkene preferred', imp: 'imp' },
    ]},
  ];

  /* ── 3. STYLES ───────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #formulas { margin-top: 24px; }
    #formulas .section-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 24px; }
    #formulas .section-header { padding: 20px 22px 16px; border-bottom: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    #formulas .section-title { font-family: 'DM Serif Display', serif; font-size: 20px; letter-spacing: -0.4px; }
    .fml-tabs { display: flex; gap: 4px; flex-wrap: wrap; padding: 14px 18px 0; }
    .fml-tab { padding: 6px 16px; border-radius: 20px; border: 1px solid var(--border); background: transparent; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-secondary); transition: all 0.15s; }
    .fml-tab:hover { border-color: var(--text-tertiary); color: var(--text-primary); }
    .fml-tab.fm-math.active { background: #EEEDF8; color: #3D3A8C; border-color: #3D3A8C; }
    .fml-tab.fm-phy.active  { background: #E4F3ED; color: #0D6B4E; border-color: #0D6B4E; }
    .fml-tab.fm-chem.active { background: #F5EBE7; color: #8C2D10; border-color: #8C2D10; }
    .fml-panel { display: none; padding: 14px 18px 18px; }
    .fml-panel.active { display: block; }
    .fml-chapter { margin-bottom: 10px; border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden; }
    .fml-chapter-head { padding: 9px 14px; background: var(--bg); cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 500; font-size: 13px; color: var(--text-primary); user-select: none; }
    .fml-chapter-head:hover { background: var(--border-light); }
    .fml-chevron { font-size: 12px; color: var(--text-tertiary); transition: transform 0.18s; }
    .fml-chapter-body { display: none; background: var(--surface); }
    .fml-chapter-body.open { display: block; }
    .fml-row { display: flex; gap: 10px; align-items: flex-start; padding: 7px 14px; border-bottom: 1px solid var(--border-light); font-size: 13px; }
    .fml-row:last-child { border-bottom: none; }
    .fml-row:hover { background: var(--bg); }
    .fml-lbl { color: var(--text-secondary); min-width: 190px; flex-shrink: 0; font-size: 12.5px; }
    .fml-val { font-family: 'JetBrains Mono', monospace; color: var(--text-primary); font-size: 12px; }
    .fml-star { display: inline-block; font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px; margin-left: 5px; vertical-align: middle; }
    .star-vvimp { background: #FAECE7; color: #8C2D10; }
    .star-imp   { background: #EEEDF8; color: #3D3A8C; }
    .fml-empty { padding: 32px; text-align: center; color: var(--text-tertiary); font-size: 13px; }
  `;
  document.head.appendChild(style);

  /* ── 4. HTML BUILDER ─────────────────────────────────────────────── */
  function buildPanel(data, id) {
    return data.map((ch, ci) => `
      <div class="fml-chapter">
        <div class="fml-chapter-head" onclick="fmlToggle(this)">
          <span>${ch.title}</span>
          <span class="fml-chevron">▾</span>
        </div>
        <div class="fml-chapter-body">
          ${ch.formulas.map(f => `
            <div class="fml-row">
              <div class="fml-lbl">${f.label}${f.imp === 'vvimp' ? '<span class="fml-star star-vvimp">★★</span>' : f.imp === 'imp' ? '<span class="fml-star star-imp">★</span>' : ''}</div>
              <div class="fml-val">${f.val}</div>
            </div>
          `).join('')}
        </div>
      </div>`).join('');
  }

  const sectionHTML = `
    <section id="formulas">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Formula Sheet</h2>
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-tertiary)">
            <span style="background:#FAECE7;color:#8C2D10;padding:2px 6px;border-radius:4px;margin-right:6px">★★ must-know</span>
            <span style="background:#EEEDF8;color:#3D3A8C;padding:2px 6px;border-radius:4px">★ important</span>
          </div>
        </div>
        <div class="fml-tabs">
          <button class="fml-tab fm-math active" onclick="fmlTab('math',this)">Mathematics</button>
          <button class="fml-tab fm-phy"  onclick="fmlTab('phy',this)">Physics</button>
          <button class="fml-tab fm-chem" onclick="fmlTab('chem',this)">Chemistry</button>
        </div>
        <div id="fml-math" class="fml-panel active">${buildPanel(MATH_DATA, 'math')}</div>
        <div id="fml-phy"  class="fml-panel">${buildPanel(PHY_DATA,  'phy')}</div>
        <div id="fml-chem" class="fml-panel">${buildPanel(CHEM_DATA, 'chem')}</div>
      </div>
    </section>`;

  /* ── 5. INJECT ───────────────────────────────────────────────────── */
  const diffSection = document.getElementById('difficulty');
  if (diffSection) {
    diffSection.insertAdjacentHTML('afterend', sectionHTML);
  } else {
    document.querySelector('main.main').insertAdjacentHTML('beforeend', sectionHTML);
  }

  /* ── 6. HANDLERS (global so onclick attrs work) ──────────────────── */
  window.fmlTab = function (id, el) {
    document.querySelectorAll('.fml-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.fml-panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('fml-' + id).classList.add('active');
  };

  window.fmlToggle = function (head) {
    const body = head.nextElementSibling;
    const chev = head.querySelector('.fml-chevron');
    const open = body.classList.toggle('open');
    chev.style.transform = open ? 'rotate(180deg)' : '';
  };

})();
