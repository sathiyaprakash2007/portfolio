"use client";

import { useEffect, useState } from "react";

interface CertificateItem {
  id: number;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_id: string;
  credential_url: string;
  image: string;
  description: string;
}

export default function Certificate() {
  const [certificates, setCertificates] = useState<
    CertificateItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // BACKEND URL
  // ==========================================

  const BACKEND_URL = "http://10.40.36.192:5000";

  // ==========================================
  // FETCH CERTIFICATES
  // ==========================================

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
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
          "Certificates:",
          data
        );

        if (data.success) {
          setCertificates(
            data.certificates || []
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch certificates:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // ==========================================
  // FORMAT DATE
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
  // GET IMAGE URL
  // ==========================================

  const getImageUrl = (
    image: string
  ) => {
    if (!image) {
      return "";
    }

    // If database already contains a full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // If database contains:
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
    console.error(
      "Certificate image failed:",
      event.currentTarget.src
    );

    event.currentTarget.style.display =
      "none";
  };

  return (
    <section
      id="certificates"
      className="bg-gray-950 text-white px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* =====================================
            HEADING
        ===================================== */}

        <div className="text-center mb-16">

          <p className="text-cyan-400 text-lg">
            My Achievements
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            My{" "}
            <span className="text-cyan-400">
              Certificates
            </span>
          </h2>

          <p className="text-gray-400 mt-5">
            Certifications and achievements I
            have earned.
          </p>

        </div>

        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (
          <p className="text-center text-gray-400">
            Loading certificates...
          </p>
        )}

        {/* =====================================
            CERTIFICATES
        ===================================== */}

        {!loading &&
          certificates.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {certificates.map(
                (certificate) => {

                  const imageUrl =
                    getImageUrl(
                      certificate.image
                    );

                  console.log(
                    "Certificate image URL:",
                    imageUrl
                  );

                  return (
                    <div
                      key={certificate.id}
                      className="
                        bg-gray-900
                        border
                        border-gray-800
                        rounded-2xl
                        overflow-hidden
                        hover:border-cyan-400
                        transition-all
                        duration-300
                      "
                    >

                      {/* =================================
                          CERTIFICATE IMAGE
                      ================================= */}

                      <div
                        className="
                          h-48
                          bg-gray-800
                          flex
                          items-center
                          justify-center
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
                              w-full
                              h-full
                              object-cover
                              block
                            "
                            loading="lazy"
                            onError={
                              handleImageError
                            }
                          />
                        ) : (
                          <span className="text-5xl">
                            🏆
                          </span>
                        )}

                      </div>

                      {/* =================================
                          CONTENT
                      ================================= */}

                      <div className="p-6">

                        <h3 className="text-xl font-bold">
                          {
                            certificate.title
                          }
                        </h3>

                        {/* ISSUER */}

                        {certificate.issuer && (
                          <p className="text-cyan-400 mt-2">
                            {
                              certificate.issuer
                            }
                          </p>
                        )}

                        {/* DATE */}

                        {certificate.issue_date && (
                          <p className="text-gray-500 text-sm mt-2">
                            Issued:{" "}
                            {formatDate(
                              certificate.issue_date
                            )}
                          </p>
                        )}

                        {/* DESCRIPTION */}

                        {certificate.description && (
                          <p className="text-gray-400 text-sm leading-6 mt-4">
                            {
                              certificate.description
                            }
                          </p>
                        )}

                        {/* CREDENTIAL ID */}

                        {certificate.credential_id && (
                          <p className="text-gray-500 text-xs mt-4">
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
                              border
                              border-cyan-400
                              text-cyan-400
                              hover:bg-cyan-400
                              hover:text-gray-950
                              transition
                            "
                          >
                            View Certificate
                          </a>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        {/* =====================================
            EMPTY
        ===================================== */}

        {!loading &&
          certificates.length === 0 && (
            <p className="text-center text-gray-400">
              No certificates available.
            </p>
          )}

      </div>
    </section>
  );
}