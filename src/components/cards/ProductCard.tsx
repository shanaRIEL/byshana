"use client";

import { useState } from "react";
import Link from "next/link";
import { type Listing } from "@/types";

export default function ProductCard({ item }: { item: Listing }) {
  const [liked, setLiked] = useState(false);

  return (
    <Link
      href={`/item/${item.id}`}
      style={{
        background: "var(--b8)",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        border: "0.5px solid var(--b6)",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "block",
      }}
      className="icard"
    >
      <div
        style={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: item.bg,
        }}
        className="iimg"
      >
        {item.badge && (
          <span
            style={{
              position: "absolute",
              top: "0.7rem",
              left: "0.7rem",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.26rem 0.65rem",
              borderRadius: 12,
              background: item.badgeBg,
              color: item.badgeColor,
            }}
            className="ibadge"
          >
            {item.badge}
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked((prev) => !prev);
          }}
          style={{
            position: "absolute",
            top: "0.7rem",
            right: "0.7rem",
            width: 28,
            height: 28,
            background: "rgba(251,247,242,0.92)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 0.2s",
            border: "none",
            padding: 0,
          }}
          className="iheart"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={liked ? "#C49A72" : "none"}
            stroke="#C49A72"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {item.cat === "women" ? (
          <svg width="78" height="110" viewBox="0 0 78 110" fill="none">
            <path
              d="M29 14 L19 40 L14 100 L64 100 L59 40 L49 14 Z"
              fill="#C9A87C"
              stroke="#7A4A2A"
              strokeWidth="1"
            />
            <path
              d="M14 100 L9 110 L69 110 L64 100"
              fill="#C9A87C"
              stroke="#7A4A2A"
              strokeWidth="1"
            />
          </svg>
        ) : (
          <svg width="78" height="110" viewBox="0 0 78 110" fill="none">
            <path
              d="M29 14 L19 40 L14 100 L64 100 L59 40 L49 14 Z"
              fill="#A67C52"
              stroke="#7A4A2A"
              strokeWidth="1"
            />
            <path
              d="M14 100 L9 110 L69 110 L64 100"
              fill="#A67C52"
              stroke="#7A4A2A"
              strokeWidth="1"
            />
          </svg>
        )}
      </div>

      <div style={{ padding: "0.9rem 1rem 1.1rem" }} className="ibody">
        <div
          style={{
            fontSize: "0.86rem",
            fontWeight: 600,
            color: "var(--b1)",
            marginBottom: "0.12rem",
          }}
          className="iname"
        >
          {item.name}
        </div>
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--b4)",
            marginBottom: "0.5rem",
          }}
          className="iowner"
        >
          By {item.owner}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: "0.6rem",
          }}
          className="irating"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              style={{
                color: i < Math.floor(item.rating) ? "var(--warm)" : "#d4c8b8",
                fontSize: "0.7rem",
              }}
              className="istar"
            >
              ★
            </span>
          ))}
          <span
            style={{ fontSize: "0.7rem", color: "var(--b4)" }}
            className="irating-count"
          >
            ({item.reviews})
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="ifooter"
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              color: "var(--b2)",
              fontWeight: 400,
            }}
            className="iprice"
          >
            £{item.price}{" "}
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.66rem",
                color: "var(--b4)",
              }}
            >
              / day
            </span>
          </div>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 500,
              padding: "0.2rem 0.55rem",
              borderRadius: 10,
              background: "var(--b6)",
              color: "var(--b2)",
            }}
            className="isize"
          >
            {item.size}
          </span>
        </div>

        <button
          style={{
            width: "100%",
            background: "var(--b8)",
            border: "1.5px solid var(--b3)",
            color: "var(--b3)",
            padding: "0.58rem",
            borderRadius: 12,
            fontSize: "0.76rem",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            marginTop: "0.8rem",
            transition: "all 0.2s",
          }}
          className="irbtn"
        >
          Rent now
        </button>
      </div>
    </Link>
  );
}
