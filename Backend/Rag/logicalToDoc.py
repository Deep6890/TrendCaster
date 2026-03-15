import json
import os


def json_to_market_text(json_data):
    lines = []

    lines.append(f"Market Date: {json_data['date']}")
    lines.append("")

    # Macro regime
    macro = json_data["macro_regime"]["current_factors"]
    macro_text = ", ".join([f"{k} {v}" for k, v in macro.items()])
    lines.append("Macro Regime:")
    lines.append(f"Current macro factors show {macro_text}.")
    lines.append("")

    # Market structure
    structure = json_data["market_structure"]
    lines.append("Market Structure:")
    lines.append(
        f"Average cross asset correlation over 60 days is "
        f"{structure['average_cross_asset_correlation_60d']} "
        f"and correlation dispersion is "
        f"{structure['correlation_dispersion_60d']}."
    )
    lines.append("")

    # Top / Weak assets from market_summary
    summary = json_data.get("market_summary", {})
    if summary:
        lines.append("Top Performing Assets:")
        lines.append(", ".join(summary.get("top_assets", [])) + ".")
        lines.append("")
        lines.append("Weak Assets:")
        lines.append(", ".join(summary.get("weak_assets", [])) + ".")
        lines.append("")

    # Asset states
    lines.append("Asset Conditions:")
    for asset, values in json_data["asset_states"].items():
        lines.append(
            f"{asset} shows trend strength {values['trend_strength']}, "
            f"trend consistency {values['trend_consistency']}, "
            f"momentum acceleration {values['momentum_acceleration']}, "
            f"cycle position {values['cycle_position']} "
            f"and volatility regime {values['volatility_regime']}."
        )

    # Sector ranking
    lines.append("")
    lines.append("Sector Ranking:")
    for entry in json_data.get("sector_ranking", []):
        lines.append(
            f"  Rank {entry['rank']:>2} | {entry['asset']:<20} | score={entry['score']}"
        )

    return "\n".join(lines)


def convert_and_save(llm_input_dict, output_dir):
    os.makedirs(output_dir, exist_ok=True)

    date_str = llm_input_dict.get("date", "unknown_date")
    filename = f"market_state_{date_str}.txt"
    output_path = os.path.join(output_dir, filename)

    text = json_to_market_text(llm_input_dict)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"[RAG] Market document saved → {output_path}")
    return output_path
