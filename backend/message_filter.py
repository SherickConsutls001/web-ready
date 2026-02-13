import re

# Patterns to detect and block in messages
BLOCKED_PATTERNS = [
    # Email patterns
    r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    r'\b(gmail|yahoo|outlook|hotmail|icloud|proton)\b',
    r'\bat\s*gmail\b',
    r'\bat\s*yahoo\b',
    
    # Phone number patterns (various formats)
    r'\+?\d[\d\s\-\(\)]{7,}\d',
    r'\b\d{3}[\s\-]?\d{3}[\s\-]?\d{4}\b',
    r'\b\d{10,}\b',
    r'\bcell\s*:?\s*\d',
    r'\bphone\s*:?\s*\d',
    r'\bcall\s+me\s+at\b',
    r'\btext\s+me\s+at\b',
    
    # Messaging apps
    r'\b(whatsapp|telegram|signal|viber|wechat|skype)\b',
    r'\bwa\s+me\b',
    r'\bwhats\s*app\b',
    
    # Social media
    r'\b(linkedin|facebook|twitter|instagram|tiktok)\b',
    r'linkedin\.com',
    r'facebook\.com',
    
    # Direct contact requests
    r'\bcontact\s+me\s+outside\b',
    r'\bmeet\s+offline\b',
    r'\blet\'?s\s+talk\s+outside\b',
    r'\bmy\s+personal\s+(email|number|phone)\b',
    
    # Common bypass attempts
    r'\b(g\.?mail|y\.?ahoo|out\.?look)\b',
    r'\d+\s*@\s*\d+',
    r'\bemail\s+me\s+at\b',
]

REPLACEMENT_TEXT = "[CONTACT INFO BLOCKED - Please use platform messaging]"

def contains_blocked_content(text: str) -> tuple[bool, list[str]]:
    """Check if text contains blocked patterns.
    
    Returns:
        tuple: (has_blocked_content, list_of_matched_patterns)
    """
    if not text:
        return False, []
    
    text_lower = text.lower()
    matched_patterns = []
    
    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            matched_patterns.append(pattern)
    
    return len(matched_patterns) > 0, matched_patterns

def filter_message(text: str) -> tuple[str, bool]:
    """Filter message and replace blocked content.
    
    Returns:
        tuple: (filtered_text, was_modified)
    """
    if not text:
        return text, False
    
    original_text = text
    
    for pattern in BLOCKED_PATTERNS:
        text = re.sub(pattern, REPLACEMENT_TEXT, text, flags=re.IGNORECASE)
    
    was_modified = text != original_text
    return text, was_modified

def is_suspicious_message(text: str) -> tuple[bool, str]:
    """Check if message shows suspicious bypass behavior.
    
    Returns:
        tuple: (is_suspicious, reason)
    """
    if not text:
        return False, ""
    
    text_lower = text.lower()
    
    # Very short message after initial contact
    if len(text.strip()) < 10:
        return True, "Very short message"
    
    # Repeated attempts to share contact
    suspicious_phrases = [
        "contact me directly",
        "reach me at",
        "my number is",
        "email is",
        "add me on",
        "find me on",
        "connect outside",
        "talk offline",
    ]
    
    for phrase in suspicious_phrases:
        if phrase in text_lower:
            return True, f"Suspicious phrase: {phrase}"
    
    return False, ""
