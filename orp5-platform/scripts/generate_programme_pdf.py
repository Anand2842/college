import json
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Top Header Accent Bar
        self.setFillColor(colors.HexColor("#123125")) # Deep Earth Green
        self.rect(0, A4[1] - 8*mm, A4[0], 8*mm, fill=1, stroke=0)
        self.setFillColor(colors.HexColor("#DFC074")) # Gold accent line
        self.rect(0, A4[1] - 9*mm, A4[0], 1*mm, fill=1, stroke=0)

        # Header Text (Pages 2+)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#123125"))
            self.drawString(18*mm, A4[1] - 14*mm, "ORP-5: 5th International Conference on Organic & Natural Rice Production Systems")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#666666"))
            self.drawRightString(A4[0] - 18*mm, A4[1] - 14*mm, "Technical Programme | 21–25 Sept 2026")
            self.setStrokeColor(colors.HexColor("#E5E7EB"))
            self.setLineWidth(0.5)
            self.line(18*mm, A4[1] - 16*mm, A4[0] - 18*mm, A4[1] - 16*mm)

        # Bottom Footer
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.5)
        self.line(18*mm, 15*mm, A4[0] - 18*mm, 15*mm)

        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#123125"))
        self.drawString(18*mm, 10*mm, "A.P. Shinde Symposium Hall, NASC Complex, New Delhi")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#888888"))
        self.drawString(100*mm, 10*mm, "www.orp5ic.com")
        self.drawRightString(A4[0] - 18*mm, 10*mm, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf():
    with open("scripts/programme_data.json") as f:
        data = json.load(f)

    pdf_path = "public/documents/ORP5_Technical_Programme.pdf"
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=16*mm,
        rightMargin=16*mm,
        topMargin=20*mm,
        bottomMargin=20*mm
    )

    styles = getSampleStyleSheet()

    c_green = colors.HexColor("#123125")
    c_gold = colors.HexColor("#B8860B")
    c_gold_bg = colors.HexColor("#FAF5E6")
    c_bg_light = colors.HexColor("#F8FAF8")
    c_border = colors.HexColor("#D1D5DB")
    c_charcoal = colors.HexColor("#1F2937")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_green,
        alignment=1
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#4B5563"),
        alignment=1
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=c_green,
        alignment=1
    )

    day_header_style = ParagraphStyle(
        'DayHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.white
    )

    session_title_style = ParagraphStyle(
        'SessionTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_green
    )

    session_time_style = ParagraphStyle(
        'SessionTime',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_gold
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=c_charcoal
    )

    bold_body_style = ParagraphStyle(
        'BoldBodyDark',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=c_charcoal
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    story = []

    # Title Banner Block
    banner_data = [
        [Paragraph("<font color='#DFC074'><b>ORP-5</b></font>", badge_style)],
        [Paragraph("<b>5th International Conference on Organic and Natural Rice Production Systems</b>", title_style)],
        [Paragraph("<b>A.P. Shinde Symposium Hall, NASC Complex, New Delhi  |  21–25 September 2026</b>", subtitle_style)],
        [Paragraph("<font color='#123125'><b>TECHNICAL PROGRAMME & SCIENTIFIC SCHEDULE</b></font><br/><font size=8 color='#666666'>Keynotes, Plenaries, Oral Presentations & Poster Sessions</font>", badge_style)]
    ]
    banner_table = Table(banner_data, colWidths=[178*mm])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F2F6F3")),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor("#A7C5B0")),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 4*mm))

    # Days Schedule Rendering
    schedule = data.get("schedule", {})

    for day_name, sessions in schedule.items():
        # Day Header Banner
        day_banner_data = [
            [Paragraph(f"<b>{day_name.upper()} SCHEDULE</b>", day_header_style)]
        ]
        day_banner = Table(day_banner_data, colWidths=[178*mm])
        day_banner.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_green),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(day_banner)
        story.append(Spacer(1, 2*mm))

        for sess in sessions:
            sess_elements = []

            # Session Header line: Time & Title
            header_cell = [
                Paragraph(sess.get('time', ''), session_time_style),
                Paragraph(sess.get('themeName') or sess.get('title', ''), session_title_style)
            ]
            sess_head_table = Table([[header_cell[0], header_cell[1]]], colWidths=[38*mm, 140*mm])
            sess_head_table.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
                ('BOTTOMPADDING', (0,0), (-1,-1), 2),
                ('TOPPADDING', (0,0), (-1,-1), 2),
            ]))
            sess_elements.append(sess_head_table)

            # Details / Chairs / Keynote
            meta_rows = []
            if sess.get('chair'):
                meta_rows.append([Paragraph("<b>Chair:</b>", bold_body_style), Paragraph(sess.get('chair', ''), body_style)])
            if sess.get('coChair'):
                meta_rows.append([Paragraph("<b>Co-Chair:</b>", bold_body_style), Paragraph(sess.get('coChair', ''), body_style)])
            if sess.get('convenors'):
                conv_text = " | ".join(sess.get('convenors', []))
                meta_rows.append([Paragraph("<b>Convenors:</b>", bold_body_style), Paragraph(conv_text, body_style)])
            if sess.get('coordinator'):
                meta_rows.append([Paragraph("<b>Coordinator:</b>", bold_body_style), Paragraph(sess.get('coordinator', ''), body_style)])
            if sess.get('keynote'):
                kn = sess.get('keynote')
                kn_text = f"<b>{kn.get('speaker')}</b> ({kn.get('designation', '')}): <i>{kn.get('title', '')}</i>"
                meta_rows.append([Paragraph("<b>Keynote:</b>", bold_body_style), Paragraph(kn_text, body_style)])
            if sess.get('panellists'):
                p_items = []
                for p in sess.get('panellists', []):
                    p_items.append(f"• <b>{p.get('name')}</b> ({p.get('designation', '')}) — <i>Topic: {p.get('topic', '')}</i>")
                meta_rows.append([Paragraph("<b>Panellists:</b>", bold_body_style), Paragraph("<br/>".join(p_items), body_style)])
            if sess.get('details'):
                meta_rows.append([Paragraph("<b>Details:</b>", bold_body_style), Paragraph(sess.get('details', ''), body_style)])
            if sess.get('scheduleBreakdown'):
                sb_items = [f"• <b>{item.get('time')}</b>: {item.get('event')}" for item in sess.get('scheduleBreakdown', [])]
                meta_rows.append([Paragraph("<b>Flow:</b>", bold_body_style), Paragraph("<br/>".join(sb_items), body_style)])

            if meta_rows:
                meta_table = Table(meta_rows, colWidths=[24*mm, 154*mm])
                meta_table.setStyle(TableStyle([
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('BACKGROUND', (0,0), (-1,-1), c_bg_light),
                    ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
                    ('TOPPADDING', (0,0), (-1,-1), 2),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
                    ('LEFTPADDING', (0,0), (-1,-1), 4),
                    ('RIGHTPADDING', (0,0), (-1,-1), 4),
                ]))
                sess_elements.append(meta_table)
                sess_elements.append(Spacer(1, 1.5*mm))

            # Oral Presentations Table
            if sess.get('oralPresentations'):
                sess_elements.append(Paragraph("<font color='#123125'><b>Oral Presentations</b></font>", bold_body_style))
                p_rows = [[
                    Paragraph("#", table_header_style),
                    Paragraph("Paper Title", table_header_style),
                    Paragraph("Presenting Author(s) & Affiliation", table_header_style)
                ]]
                for pres in sess.get('oralPresentations', []):
                    p_rows.append([
                        Paragraph(str(pres.get('id', '')), body_style),
                        Paragraph(f"<b>{pres.get('title', '')}</b>", body_style),
                        Paragraph(f"{pres.get('authors', '')}<br/><font color='#666666'><i>{pres.get('affiliation', '')}</i></font>", body_style)
                    ])
                p_table = Table(p_rows, colWidths=[8*mm, 95*mm, 75*mm])
                p_table.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), c_green),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
                    ('TOPPADDING', (0,0), (-1,-1), 2.5),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
                    ('LEFTPADDING', (0,0), (-1,-1), 3),
                    ('RIGHTPADDING', (0,0), (-1,-1), 3),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F9FAF9")])
                ]))
                sess_elements.append(p_table)
                sess_elements.append(Spacer(1, 1.5*mm))

            # Poster Presentations Table
            if sess.get('posterPresentations'):
                sess_elements.append(Paragraph("<font color='#B8860B'><b>Poster Presentations</b></font>", bold_body_style))
                pos_rows = [[
                    Paragraph("#", table_header_style),
                    Paragraph("Poster Title", table_header_style),
                    Paragraph("Author(s) & Affiliation", table_header_style)
                ]]
                for pres in sess.get('posterPresentations', []):
                    pos_rows.append([
                        Paragraph(str(pres.get('id', '')), body_style),
                        Paragraph(f"<b>{pres.get('title', '')}</b>", body_style),
                        Paragraph(f"{pres.get('authors', '')}<br/><font color='#666666'><i>{pres.get('affiliation', '')}</i></font>", body_style)
                    ])
                pos_table = Table(pos_rows, colWidths=[8*mm, 95*mm, 75*mm])
                pos_table.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), c_gold),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
                    ('TOPPADDING', (0,0), (-1,-1), 2.5),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
                    ('LEFTPADDING', (0,0), (-1,-1), 3),
                    ('RIGHTPADDING', (0,0), (-1,-1), 3),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#FFFDF5")])
                ]))
                sess_elements.append(pos_table)
                sess_elements.append(Spacer(1, 1.5*mm))

            story.append(KeepTogether(sess_elements[:2]))
            for rem in sess_elements[2:]:
                story.append(rem)
            story.append(Spacer(1, 3*mm))

        story.append(Spacer(1, 4*mm))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully at {pdf_path}")

if __name__ == "__main__":
    build_pdf()
