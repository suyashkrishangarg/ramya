"""ssrf + auth guards. every outbound fetch goes through validate_url first."""
from __future__ import annotations

import ipaddress
import socket
from urllib.parse import urlparse

BLOCKED_PORTS = {22, 25, 3306, 5432, 6379, 27017}

# cloud metadata endpoints — never fetchable, even if dns tricks are used
METADATA_HOSTS = {
    "169.254.169.254",
    "metadata.google.internal",
    "metadata.google",
    "instance-data",
}


def _ip_blocked(ip: str) -> bool:
    try:
        addr = ipaddress.ip_address(ip)
    except ValueError:
        return True
    if addr.is_private or addr.is_loopback or addr.is_link_local:
        return True
    if addr.is_multicast or addr.is_reserved or addr.is_unspecified:
        return True
    if str(addr) in METADATA_HOSTS:
        return True
    return False


def host_blocked(host: str) -> bool:
    h = (host or "").strip().lower().rstrip(".")
    if not h or h in METADATA_HOSTS:
        return True
    if h in {"localhost", "localhost.localdomain"}:
        return True
    return False


def resolve_blocked(host: str) -> bool:
    """true when the host resolves to any blocked ip (dns-rebinding safe)."""
    try:
        infos = socket.getaddrinfo(host, None, family=socket.AF_UNSPEC, type=socket.SOCK_STREAM)
    except socket.gaierror:
        return True
    ips = {info[4][0] for info in infos}
    if not ips:
        return True
    return any(_ip_blocked(ip) for ip in ips)


def validate_url(raw: str) -> tuple[bool, str]:
    """validate a crawl/search-result url. returns (ok, reason-or-clean-url)."""
    raw = (raw or "").strip()
    if len(raw) > 2048:
        return False, "url too long"
    try:
        parts = urlparse(raw)
    except ValueError:
        return False, "unparseable url"
    if parts.scheme not in {"http", "https"}:
        return False, "only http/https allowed"
    if parts.username or parts.password:
        return False, "userinfo in url not allowed"
    host = parts.hostname or ""
    if host_blocked(host):
        return False, f"blocked host: {host}"
    port = parts.port
    if port is not None:
        if port in BLOCKED_PORTS:
            return False, f"blocked port: {port}"
        if port not in {80, 443, 8080, 8443}:
            return False, f"blocked port: {port}"
    if resolve_blocked(host):
        return False, f"unresolvable or private host: {host}"
    return True, raw


def bearer_ok(header: str | None, secret: str) -> bool:
    """constant-ish time bearer check. empty secret = local-dev open mode."""
    if not secret:
        return True
    if not header or not header.lower().startswith("bearer "):
        return False
    token = header[7:].strip()
    if len(token) != len(secret):
        return False
    result = 0
    for a, b in zip(token, secret):
        result |= ord(a) ^ ord(b)
    return result == 0
