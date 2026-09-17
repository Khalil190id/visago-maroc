export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/visa" && request.method === "POST") {
      try {
        const data = await request.json();

        if (!data.first_name || !data.last_name || !data.phone || !data.destination) {
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
          crypto.randomUUID().slice(0, 8).toUpperCase();

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
        console.error(error);

        return Response.json(
          {
            ok: false,
            error: "Erreur serveur"
          },
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/api/visa" && request.method === "GET") {
      const reference = url.searchParams.get("reference");

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
        .bind(reference.trim().toUpperCase())
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
    }

    return env.ASSETS.fetch(request);
  }
};
