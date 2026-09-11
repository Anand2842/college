import os
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import mm

os.makedirs('public/documents', exist_ok=True)
pdf_path = 'public/documents/ORP5_International_Bank_Transfer_Details.pdf'

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=15*mm,
    leftMargin=15*mm,
    topMargin=15*mm,
    bottomMargin=15*mm
)

styles = getSampleStyleSheet()

conf_sub_style = ParagraphStyle(
    'ConfSub',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    alignment=1,
    textColor=colors.HexColor('#063F2B')
)

date_venue_style = ParagraphStyle(
    'DateVenue',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    alignment=1,
    textColor=colors.HexColor('#555555')
)

section_title_style = ParagraphStyle(
    'SectionTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    alignment=1,
    textColor=colors.HexColor('#123125')
)

cell_header_style = ParagraphStyle(
    'CellHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=7.5,
    leading=9.5,
    alignment=1,
    textColor=colors.white
)

cell_body_style = ParagraphStyle(
    'CellBody',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=7.5,
    leading=10.5,
    alignment=0,
    textColor=colors.HexColor('#222222')
)

cell_body_center = ParagraphStyle(
    'CellBodyCenter',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=7.5,
    leading=10.5,
    alignment=1,
    textColor=colors.HexColor('#222222')
)

sign_title_style = ParagraphStyle(
    'SignTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=13,
    alignment=2, # Right
    textColor=colors.HexColor('#123125')
)

sign_body_style = ParagraphStyle(
    'SignBody',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    alignment=2,
    textColor=colors.HexColor('#333333')
)

elements = []

# Logo and header
logo_path = 'public/orp5-logo.png'
if os.path.exists(logo_path):
    img = Image(logo_path, width=40*mm, height=14*mm)
    img.hAlign = 'CENTER'
    elements.append(img)
    elements.append(Spacer(1, 3*mm))

elements.append(Paragraph("5th INTERNATIONAL CONFERENCE ON ORGANIC & NATURAL RICE PRODUCTION SYSTEMS (ORP-5)", conf_sub_style))
elements.append(Paragraph("21 – 25 September 2026 | NASC Complex, Pusa, New Delhi, India", date_venue_style))
elements.append(Spacer(1, 4*mm))
elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0C513A'), spaceBefore=2, spaceAfter=6))

elements.append(Paragraph("OFFICIAL BANK DETAILS FOR WIRE / ONLINE PAYMENT (SWIFT & RTGS)", section_title_style))
elements.append(Spacer(1, 5*mm))

# Table content
col_widths = [8*mm, 24*mm, 28*mm, 16*mm, 42*mm, 18*mm, 22*mm, 22*mm]

headers = [
    Paragraph("<b>S.N</b>", cell_header_style),
    Paragraph("<b>Name of Bank</b>", cell_header_style),
    Paragraph("<b>Branch Name</b>", cell_header_style),
    Paragraph("<b>Branch Code</b>", cell_header_style),
    Paragraph("<b>Beneficiary Name & Account Number</b>", cell_header_style),
    Paragraph("<b>MICR No.</b>", cell_header_style),
    Paragraph("<b>IFSC Code</b>", cell_header_style),
    Paragraph("<b>SWIFT Code (Foreign)</b>", cell_header_style)
]

row_data = [
    Paragraph("<b>1</b>", cell_body_center),
    Paragraph("<b>State Bank of India</b>", cell_body_style),
    Paragraph("NSC BEEJ BHAWAN,<br/>PUSA Complex,<br/>New Delhi - 110012", cell_body_style),
    Paragraph("005389", cell_body_center),
    Paragraph("<b>All India Agricultural Students Association</b><br/><br/><b>A/C No:</b> 44767771724", cell_body_style),
    Paragraph("110002085", cell_body_center),
    Paragraph("<b>SBIN0005389</b>", cell_body_center),
    Paragraph("<b>SBININBB550</b>", cell_body_center)
]

table_data = [headers, row_data]

table = Table(table_data, colWidths=col_widths, repeatRows=1)
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0C513A')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#0C513A')),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F9FAF9'))
]))

elements.append(table)
elements.append(Spacer(1, 8*mm))

# Instructions Box
note_data = [
    [Paragraph("<b>IMPORTANT WIRE TRANSFER INSTRUCTIONS FOR FOREIGN DELEGATES:</b><br/>"
               "• Please mention your <b>Ticket ID (e.g. ORP5IC-INT-XXXXX)</b> in the transaction remarks/purpose field.<br/>"
               "• Ensure that all international wire transfer charges/intermediary bank fees are borne by the remitter.<br/>"
               "• After initiating the wire transfer, please email the SWIFT wire receipt / confirmation slip to <b>info@orp5ic.com</b> with your Ticket ID.", cell_body_style)]
]
note_table = Table(note_data, colWidths=[180*mm])
note_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FFFBEB')),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#D97706')),
    ('TOPPADDING', (0, 0), (-1, -1), 7),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
elements.append(note_table)
elements.append(Spacer(1, 14*mm))

# Signatory block
elements.append(Paragraph("<b>Authorized Signatory</b>", sign_title_style))
elements.append(Spacer(1, 2*mm))
elements.append(Paragraph("<b>Dr. Sahadeva Singh</b>", sign_title_style))
elements.append(Paragraph("Conference Chair, ORP-5<br/>Chief Policy Advisor, AIASA<br/>Mob: +91 9999641545<br/>Email: info@orp5ic.com | chiefpolicyadvisor@aiasa.org.in", sign_body_style))

doc.build(elements)
print(f"PDF generated successfully at {pdf_path}")
