import smtplib
import time
import os

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders


# ==========================================
# GMAIL CONFIGURATION
# ==========================================
EMAIL = "thegreathimalayantrekandtours@gmail.com"
APP_PASSWORD = "hbrt ywiv vzbh fqmc"


# ==========================================
# RECIPIENT EMAIL LIST
# ==========================================
email_list = [
    "pudasainivaskar2021@gmail.com",
    "pudasainibhaskar6@gmail.com",
    "virajbogati11@gmail.com"
]


# ==========================================
# EMAIL SUBJECT
# ==========================================
subject = "Exploring Business Opportunities in Travel & Destination Services"


# ==========================================
# EMAIL MESSAGE (HTML FORMAT)
# ==========================================
html_message = """
<html>
<body style="font-family: Arial, sans-serif;">

<p>Dear Sir/Madam,</p>

<p>Greetings from <b>The Great Himalayan Trek and Tours</b>.</p>

<p>
We are pleased to introduce our company as a trusted travel service provider specializing in:
</p>

<ul>
    <li>Trekking & Adventure Tours</li>
    <li>Customized Nepal Tour Packages</li>
    <li>Outbound Tours</li>
    <li>Hotel & Transportation Arrangements</li>
    <li>Flight Ticketing Services</li>
</ul>

<p>
We are reaching out to explore potential business opportunities and mutual cooperation in travel-related services.
</p>

<p>
Please find our company profile and promotional materials attached for your reference.
</p>

<p>
We would be delighted to discuss possible opportunities for collaboration and long-term business relationships.
</p>

<p>
Looking forward to hearing from you.
</p>

<br>

<p>
Best Regards,<br>
<b>The Great Himalayan Trek and Tours</b><br>
Kathmandu, Nepal<br>
Email: info@yourcompany.com<br>
WhatsApp: +977-XXXXXXXXXX
</p>

</body>
</html>
"""


# ==========================================
# IMAGE / FILE ATTACHMENTS
# ==========================================
attachments = [
    "logo.png",
    "company_profile.pdf",
    "package_image.jpg"
]


# ==========================================
# SEND EMAIL FUNCTION
# ==========================================
def send_email(receiver_email):

    msg = MIMEMultipart()

    msg["From"] = EMAIL
    msg["To"] = receiver_email
    msg["Subject"] = subject

    # Add HTML message
    msg.attach(MIMEText(html_message, "html"))

    # Attach files/images
    for file_path in attachments:

        if os.path.exists(file_path):

            with open(file_path, "rb") as attachment:

                part = MIMEBase(
                    "application",
                    "octet-stream"
                )

                part.set_payload(
                    attachment.read()
                )

                encoders.encode_base64(part)

                filename = os.path.basename(file_path)

                part.add_header(
                    "Content-Disposition",
                    f"attachment; filename={filename}"
                )

                msg.attach(part)

    try:
        server = smtplib.SMTP(
            "smtp.gmail.com",
            587
        )

        server.starttls()

        server.login(
            EMAIL,
            APP_PASSWORD
        )

        server.sendmail(
            EMAIL,
            receiver_email,
            msg.as_string()
        )

        server.quit()

        print(f"✅ Sent to: {receiver_email}")

    except Exception as e:
        print(f"❌ Failed: {receiver_email}")
        print(e)


# ==========================================
# SEND ONE BY ONE
# ==========================================
for recipient in email_list:

    send_email(recipient)

    print("⏳ Waiting 2 minutes...")
    time.sleep(120)


print("🎉 All emails sent successfully!")