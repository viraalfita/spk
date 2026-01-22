import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    borderBottom: "3 solid #2563eb",
    paddingBottom: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    backgroundColor: "#eff6ff",
    padding: 8,
    fontWeight: "bold",
    color: "#1e40af",
    borderLeft: "4 solid #2563eb",
    marginBottom: 10,
    fontSize: 11,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  infoItem: {
    width: "50%",
    marginBottom: 8,
  },
  infoItemFull: {
    width: "100%",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 9,
    color: "#666",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 10,
    color: "#000",
    marginTop: 2,
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottom: "1 solid #ddd",
    borderTop: "1 solid #ddd",
    borderLeft: "1 solid #ddd",
    borderRight: "1 solid #ddd",
    fontWeight: "bold",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #ddd",
    borderLeft: "1 solid #ddd",
    borderRight: "1 solid #ddd",
  },
  tableTotalRow: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottom: "1 solid #ddd",
    borderLeft: "1 solid #ddd",
    borderRight: "1 solid #ddd",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
  },
  tableCell1: {
    width: "50%",
  },
  tableCell2: {
    width: "25%",
    textAlign: "right",
  },
  tableCell3: {
    width: "25%",
    textAlign: "right",
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1 solid #ddd",
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    fontSize: 9,
    marginBottom: 4,
    paddingLeft: 10,
  },
  signatureSection: {
    flexDirection: "row",
    marginTop: 40,
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureLine: {
    borderTop: "1 solid #000",
    marginTop: 60,
    paddingTop: 8,
    fontSize: 10,
  },
  contractValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
  },
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface SPKDocumentProps {
  spk: any;
  payments: any[];
}

const SPKDocument: React.FC<SPKDocumentProps> = ({ spk, payments }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SURAT PERINTAH KERJA (SPK)</Text>
        <Text style={styles.subtitle}>No: {spk.spk_number}</Text>
        <Text style={styles.subtitle}>
          Tanggal: {formatDate(spk.created_at)}
        </Text>
      </View>

      {/* Vendor Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMASI VENDOR</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nama Vendor:</Text>
            <Text style={styles.infoValue}>{spk.vendor_name}</Text>
          </View>
          {spk.vendor_email && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{spk.vendor_email}</Text>
            </View>
          )}
          {spk.vendor_phone && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Telepon:</Text>
              <Text style={styles.infoValue}>{spk.vendor_phone}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Project Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETAIL PROYEK</Text>
        <View style={styles.infoItemFull}>
          <Text style={styles.infoLabel}>Nama Proyek:</Text>
          <Text style={styles.infoValue}>{spk.project_name}</Text>
        </View>
        {spk.project_description && (
          <View style={styles.infoItemFull}>
            <Text style={styles.infoLabel}>Deskripsi:</Text>
            <Text style={styles.infoValue}>{spk.project_description}</Text>
          </View>
        )}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nilai Kontrak:</Text>
            <Text style={[styles.infoValue, styles.contractValue]}>
              {formatCurrency(spk.contract_value)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mata Uang:</Text>
            <Text style={styles.infoValue}>{spk.currency}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tanggal Mulai:</Text>
            <Text style={styles.infoValue}>{formatDate(spk.start_date)}</Text>
          </View>
          {spk.end_date && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tanggal Selesai:</Text>
              <Text style={styles.infoValue}>{formatDate(spk.end_date)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RINCIAN PEMBAYARAN</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableCell1]}>Termin</Text>
            <Text style={[styles.tableCell, styles.tableCell2]}>
              Persentase
            </Text>
            <Text style={[styles.tableCell, styles.tableCell3]}>Jumlah</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCell1]}>
              Down Payment (DP)
            </Text>
            <Text style={[styles.tableCell, styles.tableCell2]}>
              {spk.dp_percentage}%
            </Text>
            <Text style={[styles.tableCell, styles.tableCell3]}>
              {formatCurrency(spk.dp_amount)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCell1]}>
              Progress Payment
            </Text>
            <Text style={[styles.tableCell, styles.tableCell2]}>
              {spk.progress_percentage}%
            </Text>
            <Text style={[styles.tableCell, styles.tableCell3]}>
              {formatCurrency(spk.progress_amount)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCell1]}>
              Final Payment
            </Text>
            <Text style={[styles.tableCell, styles.tableCell2]}>
              {spk.final_percentage}%
            </Text>
            <Text style={[styles.tableCell, styles.tableCell3]}>
              {formatCurrency(spk.final_amount)}
            </Text>
          </View>
          <View style={styles.tableTotalRow}>
            <Text style={[styles.tableCell, styles.tableCell1]}>TOTAL</Text>
            <Text style={[styles.tableCell, styles.tableCell2]}>100%</Text>
            <Text style={[styles.tableCell, styles.tableCell3]}>
              {formatCurrency(spk.contract_value)}
            </Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      {spk.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATATAN</Text>
          <Text style={styles.infoValue}>{spk.notes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.sectionTitle}>SYARAT DAN KETENTUAN</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            • Vendor wajib menyelesaikan pekerjaan sesuai dengan spesifikasi
            yang telah disepakati.
          </Text>
          <Text style={styles.listItem}>
            • Pembayaran akan dilakukan sesuai dengan termin yang tercantum
            dalam SPK ini.
          </Text>
          <Text style={styles.listItem}>
            • Vendor bertanggung jawab atas kualitas pekerjaan yang dilakukan.
          </Text>
          <Text style={styles.listItem}>
            • Perubahan scope pekerjaan harus mendapat persetujuan tertulis dari
            kedua belah pihak.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.infoLabel}>Vendor</Text>
            <Text style={styles.signatureLine}>{spk.vendor_name}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.infoLabel}>Authorized By</Text>
            <Text style={styles.signatureLine}>{spk.created_by}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default SPKDocument;
