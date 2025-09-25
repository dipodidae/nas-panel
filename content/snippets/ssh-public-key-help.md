---
title: Using the Public Key
---

Add the generated SSH public key to the `~/.ssh/authorized_keys` file for the target user on your server. This allows the application to establish **password-less SSH sessions**.

## Steps

1. **Copy the public key** from the application UI (click the **Copy** button).

2. **SSH into your target server** (using your current method):

```bash
ssh user@host
```

3. **Ensure the `.ssh` directory exists and is secured**:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

4. **Open the `authorized_keys` file with a text editor**:

```bash
nano ~/.ssh/authorized_keys
```

- If the file doesn't exist, `nano` will create it.
- Paste the **entire public key** you copied in Step 1.
- Save and exit:
  - Press `Ctrl + O` to save.
  - Press `Enter` to confirm the filename.
  - Press `Ctrl + X` to exit nano.

5. **Set proper permissions** for the file:

```bash
chmod 600 ~/.ssh/authorized_keys
```

6. **(Optional)** Test the key if you have the private key on your local machine:

```bash
ssh -i /path/to/private/key user@host
```

7. **Go back to the application** and click **Test Connection**.

> 🔁 If you regenerate the keypair later, you must **remove or replace** the old key in `authorized_keys` and repeat these steps.
