"""
Crystal Readymade — Unified Email Service (Zoho SMTP)
Handles all transactional emails: verification OTP, welcome, order events.
"""
import random
import string
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.utils import timezone


# ─────────────────────────────────────────────
# OTP Generator
# ─────────────────────────────────────────────

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))


# ─────────────────────────────────────────────
# Shared Email Sender (handles missing email gracefully)
# ─────────────────────────────────────────────

def _send(to_email: str, subject: str, text_body: str, html_body: str):
    """
    Core send helper. Silently skips if no email is configured.
    Never raises — email should never break the main request.
    """
    if not to_email or not to_email.strip():
        return
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to_email],
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=False)
    except Exception as e:
        # Log but never crash the request
        import logging
        logging.getLogger('email_service').error(f"Email to {to_email} failed: {e}")


# ─────────────────────────────────────────────
# Shared HTML wrapper
# ─────────────────────────────────────────────

def _html_wrap(title: str, body_html: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#f9f6f2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f2;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      border:1px solid #e7e1da;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:#e05b7a;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;
                         letter-spacing:-0.3px;">Crystal Readymade</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">
                crystalreadymades.com
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              {body_html}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f6f2;padding:20px 40px;text-align:center;
                       border-top:1px solid #e7e1da;">
              <p style="margin:0;color:#6f6764;font-size:12px;line-height:1.6;">
                Crystal Readymade · Aurangpura Rd, Gulmandi, Chhatrapati Sambhajinagar<br/>
                <a href="mailto:support@crystalreadymades.com"
                   style="color:#e05b7a;text-decoration:none;">support@crystalreadymades.com</a>
                &nbsp;·&nbsp; +91 91300 94080
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


# ─────────────────────────────────────────────
# 1. Email Verification OTP
# ─────────────────────────────────────────────

def send_verification_otp(user_name: str, to_email: str, otp: str):
    subject = "Verify your Crystal Readymade account"
    text = (
        f"Hi {user_name},\n\n"
        f"Your verification code is: {otp}\n\n"
        f"This code expires in 10 minutes. Do not share it with anyone.\n\n"
        f"— Crystal Readymade Team"
    )
    html = _html_wrap(subject, f"""
      <h2 style="margin:0 0 8px;color:#1f1b1c;font-size:22px;">Verify your email</h2>
      <p style="color:#6f6764;font-size:15px;margin:0 0 28px;">
        Hi <strong>{user_name}</strong>, enter the code below to verify your account.
      </p>

      <div style="text-align:center;margin:0 0 28px;">
        <div style="display:inline-block;background:#f9f6f2;border:2px dashed #e05b7a;
                    border-radius:12px;padding:20px 40px;">
          <span style="font-size:40px;font-weight:700;letter-spacing:10px;color:#e05b7a;">
            {otp}
          </span>
        </div>
        <p style="margin:12px 0 0;color:#6f6764;font-size:13px;">
          ⏱ Expires in <strong>10 minutes</strong>
        </p>
      </div>

      <p style="color:#6f6764;font-size:14px;margin:0;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    """)
    _send(to_email, subject, text, html)


# ─────────────────────────────────────────────
# 2. Welcome Email (after email verified)
# ─────────────────────────────────────────────

def send_welcome_email(user_name: str, to_email: str):
    subject = f"Welcome to Crystal Readymade, {user_name}! 🎉"
    text = (
        f"Hi {user_name},\n\n"
        f"Welcome to Crystal Readymade! Your account is now active.\n\n"
        f"Shop now: https://crystalreadymades.com\n\n"
        f"— Crystal Readymade Team"
    )
    html = _html_wrap(subject, f"""
      <h2 style="margin:0 0 8px;color:#1f1b1c;font-size:24px;">
        Welcome, {user_name}! 🎉
      </h2>
      <p style="color:#6f6764;font-size:15px;margin:0 0 20px;">
        Your email is verified and your account is ready. Explore premium
        school uniforms and clothing made with care.
      </p>

      <div style="background:#f9f6f2;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
        <p style="margin:0 0 6px;color:#1f1b1c;font-weight:600;">What you can do now:</p>
        <ul style="margin:0;padding-left:20px;color:#6f6764;font-size:14px;line-height:1.8;">
          <li>Browse our uniforms &amp; clothing collections</li>
          <li>Save favourites to your wishlist</li>
          <li>Place orders with easy checkout</li>
          <li>Track orders from your account</li>
        </ul>
      </div>

      <a href="https://crystalreadymades.com"
         style="display:inline-block;background:#e05b7a;color:#ffffff;
                text-decoration:none;padding:13px 28px;border-radius:50px;
                font-weight:600;font-size:15px;">
        Start Shopping →
      </a>
    """)
    _send(to_email, subject, text, html)


# ─────────────────────────────────────────────
# 3. Order Placed Confirmation
# ─────────────────────────────────────────────

def send_order_placed(user_name: str, to_email: str, order):
    order_id = order.id
    total = f"₹{order.total:,.2f}"
    items_html = "".join([
        f"""
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3efe9;
                     color:#1f1b1c;font-size:14px;">{item.name}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3efe9;
                     color:#6f6764;font-size:14px;text-align:center;">×{item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3efe9;
                     color:#1f1b1c;font-size:14px;text-align:right;">
            ₹{(item.price * item.quantity):,.2f}
          </td>
        </tr>
        """
        for item in order.items.all()
    ])

    subject = f"Order Confirmed — #{order_id} | Crystal Readymade"
    text = (
        f"Hi {user_name},\n\n"
        f"Your order #{order_id} has been placed successfully.\n"
        f"Total: {total}\n\n"
        f"We'll notify you when it ships.\n\n"
        f"— Crystal Readymade Team"
    )
    html = _html_wrap(subject, f"""
      <h2 style="margin:0 0 6px;color:#1f1b1c;font-size:22px;">Order Confirmed! 🛍️</h2>
      <p style="color:#6f6764;font-size:15px;margin:0 0 24px;">
        Hi <strong>{user_name}</strong>, we've received your order and it's being processed.
      </p>

      <div style="background:#f9f6f2;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0;font-size:13px;color:#6f6764;">Order ID</p>
        <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#e05b7a;">#{order_id}</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <thead>
          <tr>
            <th style="text-align:left;font-size:12px;color:#6f6764;
                       padding-bottom:8px;font-weight:600;text-transform:uppercase;
                       letter-spacing:.5px;">Item</th>
            <th style="text-align:center;font-size:12px;color:#6f6764;
                       padding-bottom:8px;font-weight:600;text-transform:uppercase;
                       letter-spacing:.5px;">Qty</th>
            <th style="text-align:right;font-size:12px;color:#6f6764;
                       padding-bottom:8px;font-weight:600;text-transform:uppercase;
                       letter-spacing:.5px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items_html}
          <tr>
            <td colspan="2" style="padding-top:12px;font-weight:700;
                                   color:#1f1b1c;font-size:15px;">Total</td>
            <td style="padding-top:12px;font-weight:700;color:#e05b7a;
                       font-size:15px;text-align:right;">{total}</td>
          </tr>
        </tbody>
      </table>

      <p style="color:#6f6764;font-size:14px;margin:0;">
        We'll send you another email when your order ships. 🚚
      </p>
    """)
    _send(to_email, subject, text, html)


# ─────────────────────────────────────────────
# 4. Order Status Update
# ─────────────────────────────────────────────

STATUS_CONFIG = {
    'processing': {
        'emoji': '⚙️',
        'label': 'Processing',
        'message': "Your order is being prepared by our team.",
        'color': '#f59e0b',
    },
    'shipped': {
        'emoji': '🚚',
        'label': 'Shipped',
        'message': "Your order is on its way! It should arrive soon.",
        'color': '#3b82f6',
    },
    'delivered': {
        'emoji': '✅',
        'label': 'Delivered',
        'message': "Your order has been delivered. We hope you love it!",
        'color': '#10b981',
    },
    'cancelled': {
        'emoji': '❌',
        'label': 'Cancelled',
        'message': "Your order has been cancelled. If this was unexpected, please contact support.",
        'color': '#ef4444',
    },
}

def send_order_status_update(user_name: str, to_email: str, order):
    cfg = STATUS_CONFIG.get(order.status, {
        'emoji': '📦',
        'label': order.status.capitalize(),
        'message': f"Your order status has been updated to {order.status}.",
        'color': '#6f6764',
    })

    tracking_html = ""
    if order.tracking_number:
        tracking_html = f"""
        <div style="background:#f9f6f2;border-radius:10px;padding:12px 16px;margin:16px 0 0;">
          <p style="margin:0;font-size:12px;color:#6f6764;">Tracking Number</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;
                    color:#1f1b1c;letter-spacing:1px;">{order.tracking_number}</p>
        </div>
        """

    subject = f"Order #{order.id} — {cfg['label']} {cfg['emoji']} | Crystal Readymade"
    text = (
        f"Hi {user_name},\n\n"
        f"Your order #{order.id} is now {cfg['label']}.\n"
        f"{cfg['message']}\n\n"
        f"— Crystal Readymade Team"
    )
    html = _html_wrap(subject, f"""
      <h2 style="margin:0 0 6px;color:#1f1b1c;font-size:22px;">
        {cfg['emoji']} Order {cfg['label']}
      </h2>
      <p style="color:#6f6764;font-size:15px;margin:0 0 20px;">
        Hi <strong>{user_name}</strong>, here's an update on your order.
      </p>

      <div style="background:#f9f6f2;border-radius:12px;padding:16px 20px;
                  border-left:4px solid {cfg['color']};margin:0 0 16px;">
        <p style="margin:0 0 4px;font-size:13px;color:#6f6764;">Order #{order.id}</p>
        <p style="margin:0;font-size:16px;font-weight:700;color:{cfg['color']};">
          {cfg['label']}
        </p>
        <p style="margin:8px 0 0;font-size:14px;color:#6f6764;">
          {cfg['message']}
        </p>
      </div>

      {tracking_html}

      <div style="margin-top:24px;">
        <a href="https://crystalreadymades.com/orders"
           style="display:inline-block;background:#e05b7a;color:#ffffff;
                  text-decoration:none;padding:12px 24px;border-radius:50px;
                  font-weight:600;font-size:14px;">
          View Order Details →
        </a>
      </div>
    """)
    _send(to_email, subject, text, html)


# ─────────────────────────────────────────────
# 5. Password Reset OTP (for future use)
# ─────────────────────────────────────────────

def send_password_reset_otp(user_name: str, to_email: str, otp: str):
    subject = "Reset your Crystal Readymade password"
    text = (
        f"Hi {user_name},\n\n"
        f"Your password reset code is: {otp}\n\n"
        f"This code expires in 10 minutes. If you didn't request this, ignore this email.\n\n"
        f"— Crystal Readymade Team"
    )
    html = _html_wrap(subject, f"""
      <h2 style="margin:0 0 8px;color:#1f1b1c;font-size:22px;">Reset your password</h2>
      <p style="color:#6f6764;font-size:15px;margin:0 0 28px;">
        Hi <strong>{user_name}</strong>, use the code below to reset your password.
      </p>

      <div style="text-align:center;margin:0 0 28px;">
        <div style="display:inline-block;background:#f9f6f2;border:2px dashed #e05b7a;
                    border-radius:12px;padding:20px 40px;">
          <span style="font-size:40px;font-weight:700;letter-spacing:10px;color:#e05b7a;">
            {otp}
          </span>
        </div>
        <p style="margin:12px 0 0;color:#6f6764;font-size:13px;">
          ⏱ Expires in <strong>10 minutes</strong>
        </p>
      </div>

      <p style="color:#6f6764;font-size:14px;margin:0;">
        If you didn't request a password reset, you can safely ignore this email.
      </p>
    """)
    _send(to_email, subject, text, html)
