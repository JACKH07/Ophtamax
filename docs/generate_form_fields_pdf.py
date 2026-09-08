#!/usr/bin/env python3
"""Génère un PDF listant les champs de chaque formulaire Ophtamax (stdlib only)."""

from __future__ import annotations

from pathlib import Path


FORMS: list[dict] = [
    {
        "title": "1. Patient",
        "routes": "/patients/nouveau  ·  /patients/:id/modifier",
        "fields": [
            ("Nom", "texte", "Oui", "—"),
            ("Prénom", "texte", "Oui", "—"),
            ("Date de naissance", "date", "Oui", "—"),
            ("Contact", "téléphone", "Oui", "—"),
            ("Profession", "texte", "Oui", "—"),
            ("Sexe", "liste", "Oui", "Masculin, Féminin"),
            ("Assurance", "liste", "Non", "Aucune, MCI, MUNASSUR, OLEA"),
            ("Antécédents", "zone de texte", "Non", "—"),
        ],
    },
    {
        "title": "2. Consultation",
        "routes": "/consultations/nouvelle  ·  /consultations/:id/modifier",
        "fields": [
            ("Patient", "liste", "Oui", "Liste des patients"),
            ("— Œil Droit / Œil Gauche —", "", "", ""),
            ("VL (Sans Corr.)", "texte", "Non", "OD et OG"),
            ("VL (Avec Corr.)", "texte", "Non", "OD et OG"),
            ("VP (Sans Corr.)", "texte", "Non", "OD et OG"),
            ("VP (Avec Corr.)", "texte", "Non", "OD et OG"),
            ("Sphère", "texte", "Non", "défaut +0.00"),
            ("Cylindre", "texte", "Non", "défaut -0.00"),
            ("Axe (°)", "texte", "Non", "défaut 0"),
            ("PIO (mmHg)", "texte", "Non", "—"),
            ("Addition", "texte", "Non", "défaut +0.00"),
            ("Segment antérieur", "zone de texte", "Non", "—"),
            ("Fond d'œil", "zone de texte", "Non", "—"),
            ("— Conclusion & Suivi —", "", "", ""),
            ("Diagnostic", "texte", "Non", "CIM-10 ou texte libre"),
            ("Prochain RDV recommandé", "date", "Non", "—"),
            ("Délai prochain RDV", "liste", "Non", "1 mois, 3 mois, 6 mois, 1 an, Selon besoin"),
            ("Conduite à tenir (CAT)", "zone de texte", "Non", "—"),
            ("Notes de traitement", "zone de texte", "Non", "—"),
            ("Notes optiques", "zone de texte", "Non", "—"),
        ],
    },
    {
        "title": "3. Ordonnance",
        "routes": "/ordonnances/nouvelle  ·  /ordonnances/:id/modifier",
        "fields": [
            ("Patient", "liste", "Oui", "Liste des patients"),
            ("Date", "date", "Oui", "—"),
            ("Médecin", "texte", "Non", "—"),
            ("Diagnostic", "texte", "Non", "—"),
            ("Ordonnance (médicaments)", "zone de texte", "Oui", "—"),
            ("Notes", "zone de texte", "Non", "—"),
        ],
    },
    {
        "title": "4. Prescription d'examen",
        "routes": "/prescription-examen/nouvelle  ·  /prescription-examen/:id/modifier",
        "fields": [
            ("Patient", "liste", "Oui", "Liste des patients"),
            ("Date", "date", "Oui", "—"),
            ("Médecin", "texte", "Non", "—"),
            ("Indication", "texte", "Non", "Motif clinique"),
            ("Examens prescrits", "zone de texte", "Oui", "Champ visuel, Rétinographie, Réfractométrie, OCT, FO dilaté"),
            ("Notes", "zone de texte", "Non", "—"),
        ],
    },
    {
        "title": "5. Prescription de lunettes",
        "routes": "/prescription-lunettes/nouvelle  ·  /prescription-lunettes/:id/modifier",
        "fields": [
            ("Patient", "liste", "Oui", "Liste des patients"),
            ("Date", "date", "Oui", "—"),
            ("Médecin", "texte", "Non", "—"),
            ("Type de verre", "liste", "Non", "Unifocaux VL/VP, Progressifs, Bifocaux, Lentilles"),
            ("OD — Sphère", "texte", "Non", "défaut +0.00"),
            ("OD — Cylindre", "texte", "Non", "défaut -0.00"),
            ("OD — Axe", "texte", "Non", "défaut 0"),
            ("OD — Addition", "texte", "Non", "—"),
            ("OG — Sphère", "texte", "Non", "défaut +0.00"),
            ("OG — Cylindre", "texte", "Non", "défaut -0.00"),
            ("OG — Axe", "texte", "Non", "défaut 0"),
            ("OG — Addition", "texte", "Non", "—"),
            ("Correction / consignes", "zone de texte", "Non", "—"),
            ("Notes", "zone de texte", "Non", "—"),
        ],
    },
    {
        "title": "6. Rendez-vous (Agenda)",
        "routes": "Modal sur /agenda",
        "fields": [
            ("Patient", "liste", "Oui", "Liste des patients"),
            ("Médecin", "liste", "Oui", "Utilisateurs rôle OPHT"),
            ("Date & heure", "date-heure", "Oui", "—"),
            ("Motif", "texte", "Oui", "min. 2 caractères"),
            ("Statut", "liste", "Non", "Planifié, En attente, En consultation, Terminé, Absent (édition)"),
        ],
    },
    {
        "title": "7. Facture",
        "routes": "Modal sur /facturation",
        "fields": [
            ("Patient", "liste", "Oui", "Liste des patients"),
            ("Date", "date", "Oui", "—"),
            ("Statut", "liste", "Oui", "Payée, Partielle, Impayée"),
            ("Mode de paiement", "liste", "Non", "Espèces, CB, Mobile Money, Chèque, Virement"),
            ("Ligne — Libellé", "texte", "Oui", "≥ 1 ligne"),
            ("Ligne — Quantité", "nombre", "Oui", "min 1"),
            ("Ligne — Prix unitaire", "nombre", "Oui", "FCFA"),
            ("Total TTC", "calculé", "—", "Affiché, non éditable"),
        ],
    },
]


WINANSI = {
    "€": 128,
    "‚": 130,
    "ƒ": 131,
    "„": 132,
    "…": 133,
    "†": 134,
    "‡": 135,
    "ˆ": 136,
    "‰": 137,
    "Š": 138,
    "‹": 139,
    "Œ": 140,
    "Ž": 142,
    "‘": 145,
    "’": 146,
    "“": 147,
    "”": 148,
    "•": 149,
    "–": 150,
    "—": 151,
    "˜": 152,
    "™": 153,
    "š": 154,
    "›": 155,
    "œ": 156,
    "ž": 158,
    "Ÿ": 159,
    "¡": 161,
    "¢": 162,
    "£": 163,
    "¤": 164,
    "¥": 165,
    "¦": 166,
    "§": 167,
    "¨": 168,
    "©": 169,
    "ª": 170,
    "«": 171,
    "¬": 172,
    "®": 174,
    "¯": 175,
    "°": 176,
    "±": 177,
    "²": 178,
    "³": 179,
    "´": 180,
    "µ": 181,
    "¶": 182,
    "·": 183,
    "¸": 184,
    "¹": 185,
    "º": 186,
    "»": 187,
    "¼": 188,
    "½": 189,
    "¾": 190,
    "¿": 191,
    "À": 192,
    "Á": 193,
    "Â": 194,
    "Ã": 195,
    "Ä": 196,
    "Å": 197,
    "Æ": 198,
    "Ç": 199,
    "È": 200,
    "É": 201,
    "Ê": 202,
    "Ë": 203,
    "Ì": 204,
    "Í": 205,
    "Î": 206,
    "Ï": 207,
    "Ð": 208,
    "Ñ": 209,
    "Ò": 210,
    "Ó": 211,
    "Ô": 212,
    "Õ": 213,
    "Ö": 214,
    "×": 215,
    "Ø": 216,
    "Ù": 217,
    "Ú": 218,
    "Û": 219,
    "Ü": 220,
    "Ý": 221,
    "Þ": 222,
    "ß": 223,
    "à": 224,
    "á": 225,
    "â": 226,
    "ã": 227,
    "ä": 228,
    "å": 229,
    "æ": 230,
    "ç": 231,
    "è": 232,
    "é": 233,
    "ê": 234,
    "ë": 235,
    "ì": 236,
    "í": 237,
    "î": 238,
    "ï": 239,
    "ð": 240,
    "ñ": 241,
    "ò": 242,
    "ó": 243,
    "ô": 244,
    "õ": 245,
    "ö": 246,
    "÷": 247,
    "ø": 248,
    "ù": 249,
    "ú": 250,
    "û": 251,
    "ü": 252,
    "ý": 253,
    "þ": 254,
    "ÿ": 255,
}


def enc(text: str) -> bytes:
    out = bytearray()
    for ch in text:
        o = ord(ch)
        if ch == "\\":
            out.extend(b"\\\\")
        elif ch == "(":
            out.extend(b"\\(")
        elif ch == ")":
            out.extend(b"\\)")
        elif o < 128:
            out.append(o)
        elif ch in WINANSI:
            out.append(WINANSI[ch])
        else:
            out.extend(ch.encode("latin-1", errors="replace"))
    return bytes(out)


class SimplePDF:
    def __init__(self, page_w=595.28, page_h=841.89, margin=40):
        self.page_w = page_w
        self.page_h = page_h
        self.margin = margin
        self.pages: list[list[tuple]] = []
        self.y = page_h - margin
        self._new_page()

    def _new_page(self):
        self.pages.append([])
        self.y = self.page_h - self.margin

    def _ensure(self, needed: float):
        if self.y - needed < self.margin:
            self._new_page()

    def text(self, x: float, size: float, content: str, bold=False):
        self.pages[-1].append(("text", x, self.y, size, content, bold))

    def line(self, x1, y1, x2, y2):
        self.pages[-1].append(("line", x1, y1, x2, y2))

    def add_title(self, content: str):
        self._ensure(36)
        self.text(self.margin, 18, content, bold=True)
        self.y -= 24
        self.line(self.margin, self.y + 8, self.page_w - self.margin, self.y + 8)
        self.y -= 10

    def add_heading(self, content: str):
        self._ensure(40)
        self.y -= 8
        self.text(self.margin, 13, content, bold=True)
        self.y -= 16

    def add_para(self, content: str, size=9):
        self._ensure(14)
        self.text(self.margin, size, content)
        self.y -= 12

    def add_row(self, cols: list[str], widths: list[float], size=8, bold=False):
        self._ensure(12)
        x = self.margin
        for col, w in zip(cols, widths):
            # truncate roughly
            max_chars = max(8, int(w / (size * 0.48)))
            shown = col if len(col) <= max_chars else col[: max_chars - 1] + "…"
            self.text(x, size, shown, bold=bold)
            x += w
        self.y -= 11

    def save(self, path: Path):
        objects: list[bytes] = []

        def add_obj(body: bytes) -> int:
            objects.append(body)
            return len(objects)

        # Catalog/Pages will be filled later
        font_regular = add_obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
        font_bold = add_obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

        page_ids = []
        content_ids = []
        for page_ops in self.pages:
            stream_parts = ["BT"]
            for op in page_ops:
                if op[0] == "text":
                    _, x, y, size, content, bold = op
                    font = "F2" if bold else "F1"
                    stream_parts.append(f"/{font} {size:.1f} Tf")
                    stream_parts.append(f"1 0 0 1 {x:.2f} {y:.2f} Tm")
                    stream_parts.append(f"({enc(content).decode('latin-1')}) Tj")
                elif op[0] == "line":
                    # lines must be outside text object; flush later via markers
                    stream_parts.append("ET")
                    _, x1, y1, x2, y2 = op
                    stream_parts.append(f"{x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")
                    stream_parts.append("BT")
            stream_parts.append("ET")
            stream = "\n".join(stream_parts).encode("latin-1")
            content_id = add_obj(
                f"<< /Length {len(stream)} >>\nstream\n".encode("latin-1") + stream + b"\nendstream"
            )
            content_ids.append(content_id)
            page_ids.append(None)  # placeholder

        pages_id = len(objects) + len(page_ids) + 1
        # create page objects
        for i, content_id in enumerate(content_ids):
            page_body = (
                f"<< /Type /Page /Parent {pages_id} 0 R "
                f"/MediaBox [0 0 {self.page_w:.2f} {self.page_h:.2f}] "
                f"/Contents {content_id} 0 R "
                f"/Resources << /Font << /F1 {font_regular} 0 R /F2 {font_bold} 0 R >> >> >>"
            ).encode("latin-1")
            page_ids[i] = add_obj(page_body)

        kids = " ".join(f"{pid} 0 R" for pid in page_ids)
        add_obj(f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode("latin-1"))
        catalog_id = add_obj(f"<< /Type /Catalog /Pages {pages_id} 0 R >>".encode("latin-1"))

        # Write file
        out = bytearray(b"%PDF-1.4\n")
        offsets = [0]
        for i, obj in enumerate(objects, start=1):
            offsets.append(len(out))
            out.extend(f"{i} 0 obj\n".encode("latin-1"))
            out.extend(obj)
            out.extend(b"\nendobj\n")
        xref_pos = len(out)
        out.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
        out.extend(b"0000000000 65535 f \n")
        for off in offsets[1:]:
            out.extend(f"{off:010d} 00000 n \n".encode("latin-1"))
        out.extend(
            f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\n"
            f"startxref\n{xref_pos}\n%%EOF\n".encode("latin-1")
        )
        path.write_bytes(out)


def build_pdf(path: Path):
    pdf = SimplePDF()
    pdf.add_title("Ophtamax — Champs des formulaires")
    pdf.add_para("Document de référence des champs UI de chaque formulaire du frontend.")
    pdf.add_para("Légende : * = obligatoire  |  Types : texte, liste, date, zone de texte, nombre")
    pdf.y -= 6

    widths = [170, 70, 45, 230]

    for form in FORMS:
        pdf.add_heading(form["title"])
        pdf.add_para(f"Routes : {form['routes']}", size=8)
        pdf.add_row(["Champ (label UI)", "Type", "Oblig.", "Options / notes"], widths, size=8, bold=True)
        pdf.line(pdf.margin, pdf.y + 6, pdf.page_w - pdf.margin, pdf.y + 6)
        pdf.y -= 2
        for label, typ, req, opts in form["fields"]:
            if typ == "" and req == "":
                pdf.add_row([label, "", "", ""], widths, size=8, bold=True)
            else:
                pdf.add_row([label, typ, req, opts], widths, size=8)
        pdf.y -= 4

    pdf.add_heading("8. Utilisateurs")
    pdf.add_para("Route : /utilisateurs — aucun formulaire de création/édition actuellement.")
    pdf.add_para("Le bouton « Nouvel utilisateur » n'est pas encore branché.")

    pdf.y -= 10
    pdf.add_para("Généré automatiquement à partir du code frontend Ophtamax.", size=8)
    pdf.save(path)


if __name__ == "__main__":
    out = Path(__file__).resolve().parent / "ophtamax-champs-formulaires.pdf"
    build_pdf(out)
    print(out)
