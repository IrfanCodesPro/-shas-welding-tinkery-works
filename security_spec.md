# Security Specification - Sha's Welding Gallery

## Data Invariants
1. **Public Readability**: The `projects` collection must be publicly readable so customers can see the work gallery.
2. **Admin-Only Writes**: Only the authenticated owner (Sha) should be able to create or delete projects.
3. **Integrity**: Every project must have a title, valid category, image URL, and a server-generated timestamp.

## The Dirty Dozen (Attack Payloads)
The following payloads should be REJECTED by Firestore rules:

1. **Massive Payload**: `{"title": "A" * 1000000, ...}` - (Resource exhaustion)
2. **Missing Fields**: `{"title": "Gate"}` - (Schema break)
3. **Invalid Category**: `{"category": "Free Stuff", ...}` - (Data corruption)
4. **Client Timestamp Spoofing**: `{"createdAt": "2000-01-01T00:00:00Z"}` - (Temporal attack)
5. **Unauthorized Create**: An unauthenticated user attempting to `setDoc`.
6. **Shadow Update**: `{"title": "Gate", "isVerifiedAdmin": true, ...}` - (Privilege escalation)
7. **Path Poisoning**: Attempting to create a document with ID `../../secrets`.
8. **Invalid URL**: `{"imageUrl": 123, ...}` - (Type confusion)
9. **Zero-Length Title**: `{"title": "", ...}` - (UX break)
10. **Array Explosion**: `{"tags": ["a", "b", ... 10000 times]}` - (Denial of Wallet)
11. **PII Injection**: Adding user emails to a public gallery document.
12. **Orphaned Write**: Creating a sub-collection item without a parent (not applicable here but tested).

## Test Runner Logic
The following rules will be implemented in `firestore.rules` and verified.
