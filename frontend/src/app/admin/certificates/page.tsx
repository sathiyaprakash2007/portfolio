"use client";

import { useEffect, useState } from "react";

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_id: string;
  credential_url: string;
  image: string;
  description: string;
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<
    Certificate[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // BACKEND URL
  // ==========================================

  const BACKEND_URL = "http://localhost:5000";

  // ==========================================
  // FETCH CERTIFICATES
  // ==========================================

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${BACKEND_URL}/api/certificates`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "Certificates API response:",
          data
        );

        if (data.success) {
          setCertificates(
            data.certificates || []
          );
        } else {
          setError(
            data.message ||
              "Failed to load certificates."
          );
        }
      } catch (error) {
        console.error(
          "Error fetching certificates:",
          error
        );

        setError(
          "Unable to connect to certificate server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (
    date: string | null
  ) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CREATE IMAGE URL
  // ==========================================

  const getImageUrl = (
    image: string
  ) => {
    if (!image) {
      return "";
    }

    // Already a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Backend returns:
    // /uploads/certificate-name.png

    if (image.startsWith("/")) {
      return `${BACKEND_URL}${image}`;
    }

    return `${BACKEND_URL}/${image}`;
  };

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  const handleImageError = (
    event: React.SyntheticEvent<
      HTMLImageElement,
      Event
    >
  ) => {
    const image =
      event.currentTarget;

    console.error(
      "Certificate image failed to load:",
      image.src
    );

    image.style.display = "none";

    const parent =
      image.parentElement;

    if (parent) {
      const errorDiv =
        document.createElement("div");

      errorDiv.className =
        "w-full h-full flex flex-col items-center justify-center text-center p-4";

      errorDiv.innerHTML = `
        <div class="text-5xl mb-3">🏆</div>
        <p class="text-red-400 text-sm">
          Certificate image could not be loaded
        </p>
      `;

      parent.appendChild(errorDiv);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section
        id="certificates"
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center">
            <p className="text-cyan-400">
              Loading certificates...
            </p>
          </div>

        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section
        id="certificates"
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center">

            <h2 className="text-4xl font-bold text-white mb-4">
              Certificates
            </h2>

            <p className="text-red-400">
              {error}
            </p>

          </div>

        </div>
      </section>
    );
  }

  // ==========================================
  // NO CERTIFICATES
  // ==========================================

  if (certificates.length === 0) {
    return (
      <section
        id="certificates"
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center">

            <h2 className="text-4xl font-bold text-white mb-4">
              Certificates
            </h2>

            <p className="text-gray-400">
              No certificates available.
            </p>

          </div>

        </div>
      </section>
    );
  }

  // ==========================================
  // CERTIFICATES SECTION
  // ==========================================

  return (
    <section
      id="certificates"
      className="py-20 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center mb-12">

          <p className="text-cyan-400 font-medium mb-2">
            My Achievements
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Certificates
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Certifications and achievements I
            have earned during my learning journey.
          </p>

        </div>

        {/* ======================================
            CERTIFICATE GRID
        ====================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {certificates.map(
            (certificate) => {

              const imageUrl =
                getImageUrl(
                  certificate.image
                );

              console.log(
                "Certificate image:",
                certificate.title,
                imageUrl
              );

              return (
                <div
                  key={certificate.id}
                  className="
                    group
                    bg-gray-900
                    border
                    border-gray-800
                    rounded-2xl
                    overflow-hidden
                    shadow-lg
                    hover:border-cyan-400
                    transition-all
                    duration-300
                  "
                >

                  {/* ==================================
                      IMAGE
                  ================================== */}

                  <div
                    className="
                      relative
                      w-full
                      h-64
                      bg-gray-800
                      overflow-hidden
                    "
                  >

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={
                          certificate.title
                        }
                        className="
                          block
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                        loading="lazy"
                        onError={
                          handleImageError
                        }
                      />

                    ) : (

                      <div
                        className="
                          w-full
                          h-full
                          flex
                          flex-col
                          items-center
                          justify-center
                        "
                      >

                        <span className="text-5xl mb-3">
                          🏆
                        </span>

                        <p className="text-gray-400 text-sm">
                          No certificate image
                        </p>

                      </div>

                    )}

                  </div>

                  {/* ==================================
                      DETAILS
                  ================================== */}

                  <div className="p-6">

                    <h3
                      className="
                        text-2xl
                        font-bold
                        text-white
                        mb-2
                      "
                    >
                      {certificate.title}
                    </h3>

                    {/* ISSUER */}

                    {certificate.issuer && (
                      <p
                        className="
                          text-cyan-400
                          font-medium
                          text-lg
                        "
                      >
                        {certificate.issuer}
                      </p>
                    )}

                    {/* DATE */}

                    {certificate.issue_date && (
                      <p
                        className="
                          text-gray-500
                          text-sm
                          mt-2
                        "
                      >
                        Issued:{" "}
                        {formatDate(
                          certificate.issue_date
                        )}
                      </p>
                    )}

                    {/* DESCRIPTION */}

                    {certificate.description && (
                      <p
                        className="
                          text-gray-400
                          text-sm
                          leading-6
                          mt-4
                        "
                      >
                        {
                          certificate.description
                        }
                      </p>
                    )}

                    {/* CREDENTIAL ID */}

                    {certificate.credential_id && (
                      <p
                        className="
                          text-gray-500
                          text-xs
                          mt-3
                        "
                      >
                        Credential ID:{" "}
                        {
                          certificate.credential_id
                        }
                      </p>
                    )}

                    {/* CREDENTIAL URL */}

                    {certificate.credential_url && (
                      <a
                        href={
                          certificate.credential_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-block
                          mt-5
                          px-4
                          py-2
                          rounded-lg
                          bg-cyan-400
                          text-gray-950
                          font-semibold
                          hover:bg-cyan-300
                          transition
                        "
                      >
                        View Credential
                      </a>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>
    </section>
  );
}