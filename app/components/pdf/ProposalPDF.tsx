import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register fonts if needed, but sticking to standard ones for simplicity
const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1a1a1a',
        backgroundColor: '#ffffff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        paddingBottom: 20,
    },
    logo: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1,
    },
    proposalTitle: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 30,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        backgroundColor: '#f3f4f6',
        padding: 6,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    text: {
        lineHeight: 1.6,
        marginBottom: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    gridItem: {
        width: '50%',
        marginBottom: 10,
    },
    label: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        color: '#666666',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    bullet: {
        width: 15,
        fontFamily: 'Helvetica-Bold',
    },
    listContent: {
        flex: 1,
        lineHeight: 1.4,
    },
    investmentBox: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#000000',
        color: '#ffffff',
        borderRadius: 4,
    },
    investmentTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    investmentAmount: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#999999',
        fontSize: 8,
    }
});

export function ProposalPDF({ proposal, booking }: { proposal: any, booking: any }) {
    const currencySymbol = proposal.currency === 'USD' ? '$' : '৳';
    const amount = proposal.currency === 'USD' ? proposal.budgetUSD : proposal.budgetBDT;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.logo}>CODE & COGNITION</Text>
                    <Text style={{ fontSize: 10, color: '#666666' }}>Proposal #{proposal.id.slice(-6).toUpperCase()}</Text>
                </View>

                <Text style={styles.proposalTitle}>Project Proposal</Text>

                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Client</Text>
                        <Text style={styles.value}>{booking.clientName}</Text>
                        <Text style={[styles.value, { color: '#666666', fontSize: 9 }]}>{booking.clientEmail}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}>{format(new Date(), 'MMMM d, yyyy')}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Service</Text>
                        <Text style={styles.value}>{booking.service?.title || 'Strategic Consultation'}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Timeline</Text>
                        <Text style={styles.value}>{proposal.estimatedDays} Days</Text>
                    </View>
                    {proposal.endDate && (
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Estimated Delivery</Text>
                            <Text style={styles.value}>{format(new Date(proposal.endDate), 'MMMM d, yyyy')}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project Scope & Objectives</Text>
                    <Text style={styles.text}>{proposal.scopeSummary}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Deliverables</Text>
                    {proposal.deliverables.map((item: string, i: number) => (
                        <View key={i} style={styles.listItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.listContent}>{item}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Timeline & Milestones</Text>
                    {proposal.milestones.map((item: string, i: number) => (
                        <View key={i} style={styles.listItem}>
                            <Text style={styles.bullet}>{i + 1}.</Text>
                            <Text style={styles.listContent}>{item}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Investment & Terms</Text>
                    <View style={styles.investmentBox}>
                        <Text style={styles.investmentTitle}>Total Project Investment</Text>
                        <Text style={styles.investmentAmount}>{currencySymbol}{amount?.toLocaleString()}</Text>
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.label}>Payment Schedule</Text>
                        <Text style={styles.text}>{proposal.paymentTerms || 'To be discussed.'}</Text>
                    </View>
                </View>

                <View style={styles.section} break>
                    <Text style={styles.sectionTitle}>Agreement & Contract</Text>
                    <Text style={[styles.text, { fontSize: 9, color: '#333333' }]}>
                        {proposal.contractText || 'Standard terms apply.'}
                    </Text>
                </View>

                <View style={styles.section}>
                    <View style={{ marginTop: 40, flexDirection: 'row', gap: 50 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#cccccc', height: 40 }} />
                            <Text style={{ marginTop: 5, fontSize: 8, color: '#666666' }}>Code & Cognition Representative</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#cccccc', height: 40 }} />
                            <Text style={{ marginTop: 5, fontSize: 8, color: '#666666' }}>Client Acceptance ({booking.clientName})</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footerContainer}>
                    <Text>© {new Date().getFullYear()} Code & Cognition</Text>
                    <Text>Confidential Proposal</Text>
                    <Text
                        render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number | null }) => (
                            `Page ${pageNumber} of ${totalPages}`
                        )}
                        fixed
                    />
                </View>
            </Page>
        </Document>
    );
}
