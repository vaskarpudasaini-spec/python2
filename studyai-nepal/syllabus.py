# Official NEB (Nepal) +2 Science syllabus — chapter names only, grouped by unit.
# Source: NEB curriculum (CDC), cross-checked via nebexam.com chapter listings.
# This exists so the AI can only ever reference REAL chapters, never invented ones.
#
# Currently covers Physics and Chemistry (Class 11 & 12) — the two subjects
# tested so far. Add Biology / Math / English the same way when you're ready
# to test those with students.

SYLLABUS = {
    "physics": {
        11: {
            "Mechanics": [
                "Physical quantities", "Vectors", "Kinematics", "Dynamics",
                "Work, energy and power", "Circular motion", "Gravitation", "Elasticity",
            ],
            "Heat and Thermodynamics": [
                "Heat and temperature", "Thermal expansion", "Quantity of heat",
                "Rate of heat flow", "Ideal gas",
            ],
            "Wave and Optics": [
                "Reflection at curved mirror", "Refraction at plane surfaces",
                "Refraction through prisms", "Lenses", "Dispersion",
            ],
            "Electricity and Magnetism": [
                "Electric charges", "Electric field",
                "Potential, potential difference and potential energy",
                "Capacitor", "DC circuits",
            ],
            "Modern Physics": [
                "Nuclear physics", "Solids", "Recent trends in physics",
            ],
        },
        12: {
            "Mechanics": [
                "Rotational dynamics", "Periodic motion", "Fluid statics",
            ],
            "Heat and Thermodynamics": [
                "First law of thermodynamics", "Second law of thermodynamics",
            ],
            "Wave and Optics": [
                "Wave motion", "Mechanical waves", "Wave in pipes and strings",
                "Acoustic phenomena", "Nature and propagation of light",
                "Interference", "Diffraction", "Polarization",
            ],
            "Electricity and Magnetism": [
                "Electrical circuits", "Thermoelectric effects", "Magnetic field",
                "Magnetic properties of materials", "Electromagnetic Induction",
                "Alternating currents",
            ],
            "Modern Physics": [
                "Electrons", "Photons", "Semiconductor devices",
                "Quantization of energy", "Radioactivity and nuclear reaction",
                "Recent trends in physics",
            ],
        },
    },
    "chemistry": {
        11: {
            "General and Physical Chemistry": [
                "Foundation and fundamentals", "Stoichiometry", "Atomic structure",
                "Classification of elements and periodic table",
                "Chemical bonding and shapes of molecules", "Oxidation and reduction",
                "States of matter", "Chemical equilibrium",
            ],
            "Inorganic Chemistry": [
                "Chemistry of nonmetals", "Chemistry of metals", "Bioinorganic chemistry",
            ],
            "Organic Chemistry": [
                "Basic concept of organic chemistry",
                "Fundamental principles of organic chemistry",
                "Hydrocarbons", "Aromatic hydrocarbons",
            ],
            "Applied Chemistry": [
                "Fundamentals of applied chemistry", "Modern chemical manufactures",
            ],
        },
        12: {
            "General and Physical Chemistry": [
                "Volumetric analysis", "Ionic equilibrium", "Chemical kinetics",
                "Thermodynamics", "Electrochemistry",
            ],
            "Inorganic Chemistry": [
                "Transition metals", "Studies of heavy metals",
            ],
            "Organic Chemistry": [
                "Haloalkanes", "Haloarenes", "Alcohols", "Phenols", "Ethers",
                "Aldehydes and ketones", "Carboxylic acid and its derivatives",
                "Nitro compounds", "Amines", "Organometallic compounds",
            ],
            "Applied Chemistry": [
                "Chemistry in the service of mankind", "Cement", "Paper and pulp",
                "Nuclear chemistry and application of radioactivity",
            ],
        },
    },
}


def get_class_number(class_level: str) -> int | None:
    """Map a free-text class level like 'Class 11' to 11, or None if not recognized."""
    for n in (11, 12):
        if str(n) in class_level:
            return n
    return None


def build_syllabus_context(class_level: str, subjects: str) -> str:
    """
    Build a text block listing the REAL NEB chapters for any subject the student
    mentioned that we have data for. Returns "" if nothing matches (e.g. Biology,
    Math — not yet added), in which case the AI falls back to general study
    techniques without inventing chapter names for that subject.
    """
    class_num = get_class_number(class_level)
    if class_num is None:
        return ""

    subjects_lower = subjects.lower()
    blocks = []

    for subject_key, by_class in SYLLABUS.items():
        if subject_key in subjects_lower and class_num in by_class:
            units = by_class[class_num]
            lines = [f"Official NEB Class {class_num} {subject_key.title()} chapters:"]
            for unit, chapters in units.items():
                lines.append(f"  {unit}: {', '.join(chapters)}")
            blocks.append("\n".join(lines))

    return "\n\n".join(blocks)


def get_wrong_level_chapters(class_level: str, subjects: str) -> set[str]:
    """
    Return chapter names (lowercase) that belong to the OTHER class level for any
    matched subject, but NOT the student's actual class. Used to catch the AI
    reaching for a chapter that exists in the syllabus but at the wrong grade
    (e.g. using Class 11's "Kinematics" in a Class 12 plan).
    """
    class_num = get_class_number(class_level)
    if class_num is None:
        return set()
    other_num = 12 if class_num == 11 else 11

    subjects_lower = subjects.lower()
    wrong = set()
    for subject_key, by_class in SYLLABUS.items():
        if subject_key not in subjects_lower:
            continue
        if class_num not in by_class or other_num not in by_class:
            continue
        current_chapters = {c.lower() for unit in by_class[class_num].values() for c in unit}
        other_chapters = {c.lower() for unit in by_class[other_num].values() for c in unit}
        wrong |= (other_chapters - current_chapters)
    return wrong