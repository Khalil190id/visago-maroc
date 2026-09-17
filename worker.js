export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================
    // CREATE VISA REQUEST
    // =========================
    if (
      url.pathname === "/api/visa" &&
      request.method === "POST"
    ) {
      try {
        const data = await request.json();

        if (
          !data.first_name ||
          !data.last_name ||
          !data.phone ||
          !data.destination
        ) {
          return Response.json(
            {
              ok: false,
              error: "Champs obligatoires manquants"
            },
            { status: 400 }
          );
        }

        const reference =
          "VGM-" +
          new Date().getFullYear() +
          "-" +
          crypto
            .randomUUID()
            .slice(0, 8)
            .toUpperCase();

        await env.DB.prepare(`
          INSERT INTO visa_requests (
            reference,
            first_name,
            last_name,
            birth_date,
            nationality,
            passport,
            passport_expiry,
            phone,
            email,
            destination,
            visa_type,
            travel_date,
            travellers,
            message
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
          .bind(
            reference,
            data.first_name || "",
            data.last_name || "",
            data.birth_date || "",
            data.nationality || "",
            data.passport || "",
            data.passport_expiry || "",
            data.phone || "",
            data.email || "",
            data.destination || "",
            data.visa_type || "",
            data.travel_date || "",
            Number(data.travellers) || 1,
            data.message || ""
          )
          .run();

        return Response.json({
          ok: true,
          reference
        });
      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: "Erreur serveur"
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // TRACK VISA REQUEST
    // =========================
    if (
      url.pathname === "/api/visa" &&
      request.method === "GET"
    ) {
      try {
        const reference =
          url.searchParams
            .get("reference")
            ?.trim()
            .toUpperCase();

        if (!reference) {
          return Response.json(
            {
              ok: false,
              error: "Référence manquante"
            },
            { status: 400 }
          );
        }

        const result = await env.DB.prepare(`
          SELECT reference, status, created_at
          FROM visa_requests
          WHERE reference = ?
        `)
          .bind(reference)
          .first();

        if (!result) {
          return Response.json(
            {
              ok: false,
              error: "Demande introuvable"
            },
            { status: 404 }
          );
        }

        return Response.json({
          ok: true,
          request: result
        });
      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: "Erreur serveur"
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // ADMIN LOGIN
    // =========================
    if (
      url.pathname === "/api/admin/login" &&
      request.method === "POST"
    ) {
      try {
        const data = await request.json();

        const password = String(
          data.password || ""
        ).trim();

        const adminPassword = String(
          env.ADMIN_PASSWORD || ""
        ).trim();

        if (!adminPassword) {
          return Response.json(
            {
              ok: false,
              error:
                "ADMIN_PASSWORD n'est pas configuré dans Cloudflare."
            },
            { status: 500 }
          );
        }

        if (password !== adminPassword) {
          return Response.json(
            {
              ok: false,
              error: "Mot de passe incorrect"
            },
            { status: 401 }
          );
        }

        return Response.json({
          ok: true,
          message: "Connexion réussie"
        });
      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: "Erreur de connexion"
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // ADMIN - GET REQUESTS
    // =========================
    if (
      url.pathname === "/api/admin/requests" &&
      request.method === "GET"
    ) {
      const password =
        request.headers.get("X-Admin-Password") || "";

      if (
        String(password).trim() !==
        String(env.ADMIN_PASSWORD || "").trim()
      ) {
        return Response.json(
          {
            ok: false,
            error: "Non autorisé"
          },
          { status: 401 }
        );
      }

      try {
        const result = await env.DB.prepare(`
          SELECT
            id,
            reference,
            first_name,
            last_name,
            birth_date,
            nationality,
            passport,
            passport_expiry,
            phone,
            email,
            destination,
            visa_type,
            travel_date,
            travellers,
            message,
            status,
            created_at
          FROM visa_requests
          ORDER BY id DESC
        `).all();

        return Response.json({
          ok: true,
          requests: result.results || []
        });
      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: "Erreur base de données"
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // ADMIN - UPDATE STATUS
    // =========================
    if (
      url.pathname === "/api/admin/status" &&
      request.method === "POST"
    ) {
      const password =
        request.headers.get("X-Admin-Password") || "";

      if (
        String(password).trim() !==
        String(env.ADMIN_PASSWORD || "").trim()
      ) {
        return Response.json(
          {
            ok: false,
            error: "Non autorisé"
          },
          { status: 401 }
        );
      }

      try {
        const data = await request.json();

        const allowedStatuses = [
          "Nouveau",
          "En cours",
          "Approuvé",
          "Refusé"
        ];

        if (
          !data.reference ||
          !allowedStatuses.includes(data.status)
        ) {
          return Response.json(
            {
              ok: false,
              error: "Données invalides"
            },
            { status: 400 }
          );
        }

        await env.DB.prepare(`
          UPDATE visa_requests
          SET status = ?
          WHERE reference = ?
        `)
          .bind(
            data.status,
            data.reference
          )
          .run();

        return Response.json({
          ok: true
        });
      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: "Erreur serveur"
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // WEBSITE
    // =========================
return new Response("Not Found", { status: 404 });
  }
};
