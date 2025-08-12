'use client';
import { Box, Container, Typography } from '@/components';

export default function TermAndCondition() {
  return (
    <section>
      <Container className="text-white">
        <Box className="px-4 lg:px-8 xl:px-0">
          <Typography type="heading" size={24}>
            Terms & Conditions
          </Typography>

          {/* Main ordered list with uppercase lettered style (A., B., C., ...) */}
          <ol
            style={{ listStyleType: 'upper-alpha' }}
            className="font-bebas pl-6 text-xl">
            <li className="mt-6">
              PREFACE
              <Typography type="body" size={14} className="mb-4">
                Welcome to WUKONG ("Platform"), managed by PT Aku Rela Kamu
                Bahagia ("Company"), which provides event ticket purchasing
                services through the Ticket Management system ("Our Services")
                at www.wukong.co.id.
              </Typography>
              <Typography type="body" size={14}>
                The party organizing the event is referred to as the "Seller"
                (Promoter, EO, Event Owner), while the user purchasing tickets
                is the "Customer". By using the Platform, you agree to be bound
                by these Terms & Conditions. If you do not agree, please refrain
                from using our services.
              </Typography>
            </li>

            <li className="mt-6">
              DEFINITION
              <Typography type="body" size={14} className="mb-4">
                Unless specifically defined below and elsewhere in the Terms of
                Use, capitalized terms used have the following meanings:
              </Typography>
              {/* Nested ordered list with lowercase lettered style (a., b., c., ...) */}
              <ol
                className="font-onest space-y-1 pl-4 text-sm"
                style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  <strong>“Account”</strong> the access granted to Customers to
                  obtain information and purchase event tickets through the
                  WUKONG platform
                </li>
                <li>
                  <strong>“AML (Anti Money Laundering)”</strong> activities to
                  anticipate and prevent money laundering practices
                </li>
                <li>
                  <strong>“You”</strong> or <strong>“Customer”</strong> any
                  individual or legal entity that uses, accesses, utilizes
                  and/or creates an account on wukong.co.id
                </li>
                <li>
                  <strong>“Event”</strong> any commercial or non-commercial
                  activity organized by an Event Creator using our Platform
                  services
                </li>
                <li>
                  <strong>“Event Creator”</strong> an individual, association,
                  legal entity, or other body that organizes Events as
                  organizers, promoters, committees and/or owners who
                  collaborate with us using our Platform services including but
                  not limited to the services we provide on the Site
                </li>
                <li>
                  <strong>“Event Ticket Price”</strong> the official selling
                  price of an Event Ticket listed on the WUKONG platform‍
                </li>
                <li>
                  <strong>“Password”</strong> is a secure alphanumeric code of
                  an alphanumeric sequence or a combination of both used by
                  Customers to authenticate access to their accounts on the
                  WUKONG platform
                </li>
                <li>
                  <strong>“Event Ticket Trading Activities”</strong>{' '}
                  transactions involving the buying and selling of Event Tickets
                  based on agreed value points via the WUKONG platform
                </li>
                <li>
                  <strong>“KYC (Know Your Customer) Principles”</strong> a
                  process to assess Prospective Customers and Customers to
                  determine the background and good faith of the actions to be
                  carried out in an Event Ticket trading activity
                </li>
                <li>
                  <strong>“Services”</strong> ticket purchasing and trading
                  facilitation provided by WUKONG
                </li>
                <li>
                  <strong>“Partners”</strong> means parties who have
                  collaborated with us, including but not limited to cooperation
                  in reusing our Platform to provide Tickets both online and
                  directly face-to-face or offline
                </li>
                <li>
                  <strong>“Telephone Number”</strong> a verified Customer
                  contact number used for account authorization
                </li>
                <li>
                  <strong>“Customer"</strong> means any individual and/or legal
                  entity that legally purchases a Ticket, either for a fee or
                  free of charge, for an Event organized by an Event Creator in
                  accordance with these Terms of Use, the terms and conditions
                  applicable at the Event venue, the Event Creator’s terms and
                  conditions, and all applicable laws and regulations
                </li>
                <li>
                  <strong>“Bank Account”</strong> a registered Customer bank
                  account under the same name as the Customer
                </li>
                <li>
                  <strong>“Registration”</strong> is the initial process of
                  registering to become a Customer on the WUKONG platform which
                  is an initial verification process to obtain information,
                  statements in the use of platform service ‍
                </li>
                <li>
                  <strong>“Rupiah”</strong> is the currency of Indonesia which
                  is used for the purchase and sale of Event Tickets on the
                  WUKONG Platform
                </li>
                <li>
                  <strong>“Sign in”</strong> is the process of logging into the
                  WUKONG platform system by entering identification data and
                  self-authentication
                </li>
                <li>
                  <strong>“Ticket”</strong> means proof of legal rights to enter
                  the venue where the Event is taking place, enjoy a performance
                  performed by the Event, use and/or utilize an activity related
                  to the Event organized by the Event Creator in accordance with
                  the date, time, place, type and/or other provisions attached
                  to the entrance ticket that has been legally selected, ordered
                  and purchased by the Customer, either in physical, electronic
                  or other media forms used by us from time to time and has been
                  equipped with a unique code (barcode) as a security system on
                  the ticket
                </li>
                <li>
                  <strong>“Verification”</strong> is the process of examining
                  the Customer regarding information related to the Customer and
                  personal information listed in the Registration process to be
                  validated by WUKONG in order to receive full platform services
                  via email
                </li>
                <li>
                  <strong>“Website”</strong> refers to the online site with the
                  address wukong.co.id managed by WUKONG, without limitation to
                  the owners, investors, employees and parties related to
                  WUKONG. Depending on the context, “Website” may also refer to
                  services, products, sites, content or other services provided
                  by WUKONG
                </li>
                <li>
                  <strong>“WUKONG”, “We”, or “Platform”</strong> refers to PT
                  Aku Rela Kamu Bahagia, a limited liability company
                  incorporated under Indonesian law and domiciled in Central
                  Jakarta
                </li>
              </ol>
            </li>

            <li className="mt-6">
              GENERAL TERMS
              <ol
                style={{ listStyleType: 'decimal' }}
                className="font-onest space-y-1 pl-4 text-sm">
                <li>
                  We provide ticket booking and purchasing services for events
                  organized by Sellers. We act as an intermediary between
                  Sellers and Users
                </li>
                <li>
                  If there is a conflict or inconsistency between two or more
                  provisions in the Terms of Use and the terms of use of Our
                  Partners. Regarding such conflict or inconsistency, we will
                  determine the applicable provisions
                </li>
                <li>
                  We will publish any substantial changes or amendments to these
                  Terms of Use (if any) through the Platform
                </li>
                <li>
                  All Ticket bookings by Customers for Events organized by Event
                  Creators through our Platform are separate agreements from the
                  agreements arising from this agreement based on these Terms of
                  Use, in which the agreements arising between Customers and
                  Event Creators, each party is bound and subject to the
                  agreement
                </li>
                <li>
                  We are a Platform provider that collaborates with Event
                  Creators, while all Tickets sold to Customers belong to Event
                  Creators. All forms of data and information regarding Tickets
                  that Event Creators provide in which we inform potential
                  Customers, are an offer from Event Creators to potential
                  Customers. Therefore, we are not a party in the event of a
                  dispute, claim, claim, claim, compensation, loss, injury,
                  death, and/or claim for any right arising directly or
                  indirectly from the implementation
                </li>
                <li>
                  Event Creator has understood and agreed that WUKONG does not
                  provide any guarantee in any form for the success of the
                  Event, either in the form of Ticket sales or the smooth
                  implementation of the Event. For that, Event Creator releases
                  and discharges WUKONG and bears all forms of demands,
                  lawsuits, requests, losses, claims, and/or all forms of
                  replacement of rights by any party including Event Creator
                  itself arising from including but not limited to Ticket sales
                  and the implementation of the Event
                </li>
              </ol>
            </li>

            {/* Additional sections with lettered nested lists */}
            <li className="mt-6">
              USER ACCOUNT
              <ol
                style={{ listStyleType: 'decimal' }}
                className="font-onest space-y-1 pl-4 text-sm">
                <li>
                  To use some services, you must register and create an Account
                </li>
                <li>
                  The following are the requirements for becoming a Customer:
                </li>
                <ol
                  style={{ listStyleType: 'lower-alpha' }}
                  className="font-onest space-y-1 pl-4 text-sm">
                  <li>
                    Conducting the Customer registration or registration process
                    through the WUKONG platform;
                  </li>
                  <li>
                    Agree to be subject to these General Terms and Conditions;
                  </li>
                  <li>Be at least 17 (seventeen) years old or married;</li>
                  <li>
                    Have a legally valid identity:
                    <ol className="font-onest list-decimal space-y-1 pl-4 text-sm">
                      <li>KTP/SIM for Indonesian citizen</li>
                      <li>Passport/KITAS for foreign citizen</li>
                    </ol>
                  </li>
                </ol>
                <li>
                  You are responsible for the security of your account
                  information, including your password
                </li>
                <li>
                  You agree that the process of becoming a WUKONG Customer will
                  only be effective after all requirements have been met and the
                  registration process has gone through a verification process
                  for approval. All risks arising in connection with the
                  closing/blocking/freezing of an Account caused by the
                  Customer's error and/or negligence will be the Customer's
                  responsibility and WUKONG will not provide compensation to the
                  Customer or any Party in any form for any demands/claims and
                  compensation in connection with the closing of the Account
                </li>
                <li>
                  All data, statements, information, statements, documents
                  obtained by Us regarding the Customer will become Our
                  property. So, We have the right to verify, match, assess, keep
                  confidential or use it for the benefit of WUKONG in accordance
                  with applicable legal provisions
                </li>
                <li>
                  WUKONG will regulate, manage and supervise according to the
                  established procedures for all data, statements, information,
                  statements, documents or anything related to Customers or
                  Customer business activities or transactions related to the
                  Account
                </li>
              </ol>
            </li>

            <li className="mt-6">
              PAYMENT TRANSACTION
              <ol
                style={{ listStyleType: 'decimal' }}
                className="font-onest space-y-1 pl-4 text-sm">
                <li>
                  {' '}
                  All transactions on the Platform are conducted in Rupiah
                  currency
                </li>
                <li>
                  Refunds are subject to the policies of each Event Creator
                </li>
                <li>
                  You are responsible for ensuring that your purchase data is
                  correct
                </li>
                <li>
                  You understand, comprehend and agree that every transaction
                  that has been conducted through WUKONG is final and cannot be
                  canceled by the Customer
                </li>
                <li>
                  WUKONG is authorized to monitor Customer Accounts in order to
                  prevent financial crimes
                </li>
                <li>
                  If there is any suspicious transaction conducted through Our
                  Services, We have the right to stop/deactivate the Account and
                  block transaction funds and postpone transactions to the
                  Customer, until notification from Us
                </li>
              </ol>
            </li>

            <li className="mt-6">
              PROHIBITED USE
              <Typography type="body" size={14} className="mb-4">
                In using Our Services, Customers are prohibited from doing the
                following:
              </Typography>
              <ol
                style={{ listStyleType: 'lower-alpha' }}
                className="font-onest space-y-1 pl-4 text-sm">
                <li>
                  {' '}
                  It is not permitted to take actions that may result in losses
                  for WUKONG and/or that are contrary to the Terms of Use and
                  applicable laws and regulations
                </li>
                <li>
                  If the Customer violates one or more provisions in these
                  provisions, the Customer is fully responsible for the
                  violation. We have the right to limit the use of WUKONG's
                  services and the Customer agrees that We will not provide
                  compensation and/or liability in any form for any risks or
                  consequences arising from the limitation of the use of the
                  service. The Customer is then obliged to pay compensation to
                  WUKONG in the amount of the loss that may be experienced due
                  to the violation
                </li>
              </ol>
            </li>

            <li className="mt-6">
              VIOLATION
              <Typography type="body" size={14} className="mb-4">
                Without prejudice to other provisions contained in these Terms
                of Use, Our regulations or based on applicable laws, We may
                limit your activities, warn you, and/or refuse to provide access
                to the Platform, and/or other actions based on Our policies, if:
              </Typography>
              <ol
                style={{ listStyleType: 'lower-alpha' }}
                className="font-onest space-y-1 pl-4 text-sm">
                <li>
                  You violate these Terms of Use, laws and/or other related
                  documents
                </li>
                <li>
                  You provide Data and/or information that is not valid, valid,
                  legal, false and/or cannot be verified by Us
                </li>
                <li>
                  We believe that your actions may violate the rights of third
                  parties or violate applicable laws or result in liability for
                  us, you and/or other users including prospective Customers
                </li>
              </ol>
            </li>

            <li className="mt-6">
              INTELLECTUAL PROPERTY RIGHTS
              <Typography type="body" size={14} className="mb-4">
                You acknowledge and agree that We are the holder of ownership
                rights to the services, software, technology tools and content,
                sites, and other materials including Intellectual Property
                Rights related to WUKONG facilities.
              </Typography>
              <Typography type="body" size={14}>
                You are only permitted to view, print and/or download copies of
                materials from the Website for personal and non-commercial use.
                All commercial use requires permission from us. Any commercial
                activity without Our permission is deemed to be a violation of
                WUKONG's Intellectual Property Rights and will result in
                termination of the Account.
              </Typography>
            </li>

            <li className="mt-6">
              CONFIDENTIALITY
              <Typography type="body" size={14} className="mb-4">
                During cooperation with Us and at any time thereafter, then:
              </Typography>
              <ol
                style={{ listStyleType: 'lower-alpha' }}
                className="font-onest space-y-1 pl-4 text-sm">
                <li>
                  Any information and/or data provided by Us to the Customer and
                  otherwise given or delivered verbally, in writing, graphically
                  or delivered via electronic media or information and/or data
                  in other forms during the course of the discussion or during
                  other work is confidential (then referred as "Confidential
                  Information")
                </li>
                <li>
                  The Customer agrees and accepts that at all times they will
                  keep confidential information obtained as part of the
                  implementation of the cooperation confidential to anyone or
                  will not use it for the benefit of the Customer or the benefit
                  of other parties, without first obtaining written approval
                  from an authorized official of WUKONG or other authorized
                  party in accordance with applicable laws
                </li>
                <li>
                  If the Customer violates the provisions as referred to in
                  number 1 and 2 of these provisions regarding confidentiality,
                  then all losses, claims and/or lawsuits experienced by WUKONG
                  are the full responsibility of the Customer. The Customer
                  hereby agrees that WUKONG will not provide compensation and/or
                  liability in any form to the Customer or any party for any
                  claims and/or lawsuits that may arise in the future in
                  connection with the violation
                </li>
                <li>
                  The obligation to keep confidential information as referred to
                  in number 1 and 2 of the provisions regarding confidentiality
                  shall not apply if:
                </li>
                <ol className="font-onest list-decimal space-y-1 pl-4 text-sm">
                  <li>
                    The confidential information becomes available to the
                    general public
                  </li>
                  <li>
                    The confidential information is ordered to be disclosed to
                    fulfill a court order or other authorized government agency
                  </li>
                  <li>
                    The confidential information is provided in accordance with
                    applicable laws
                  </li>
                </ol>
                <li>
                  The Customer further agrees to make every effort and take
                  every necessary action to prevent third parties from gaining
                  access to or causing the disclosure of confidential
                  information
                </li>
                <li>
                  In the event that the cooperation has ended, the Customer
                  agrees that the obligation to keep confidential documents and
                  materials that constitute confidential information as
                  stipulated in these provisions shall remain in effect
                </li>
              </ol>
            </li>

            <li className="mt-6">
              TAX
              <Typography type="body" size={14}>
                That the tax on Event Ticket trading activities is a tax borne
                by each party, in this case the Customer and WUKONG. WUKONG does
                not bear the Customer's tax unless otherwise specified in these
                Terms of Use.
              </Typography>
            </li>

            <li className="mt-6">
              FORCE MAJEURE
              <Typography type="body" size={14} className="mb-4">
                Force Majeure is an event that occurs beyond the ability and
                control of WUKONG so that it affects the implementation of
                transactions including but not limited to:
              </Typography>
              <ol
                style={{ listStyleType: 'lower-alpha' }}
                className="font-onest mb-4 space-y-1 pl-4 text-sm">
                <li>
                  Earthquakes, hurricanes, floods, landslides, volcanic
                  eruptions and other natural disasters
                </li>
                <li>
                  War, demonstrations, riots, terrorism, sabotage, embargoes,
                  and mass strikes
                </li>
                <li>Government economic policies that directly affect</li>
              </ol>
              <Typography type="body" size={14}>
                As long as We have carried out all obligations in accordance
                with applicable laws and regulations in connection with the
                occurrence of Force Majeure, then We will not provide
                compensation and/or liability in any form to Customers or any
                other party for any risks, responsibilities and claims that may
                arise in connection with delays or failure to carry out
                obligations due to Force Majeure.
              </Typography>
            </li>

            <li className="mt-6">
              RESPONSIBILITY
              <Typography type="body" size={14} className="mb-4">
                WUKONG always strives to maintain a safe, convenient and
                well-functioning Service, but we cannot guarantee continuous
                operation or that access to our Services is always perfect.
                There is a possibility that information and data on the WUKONG
                site are not available in real time.
              </Typography>
              <Typography type="body" size={14} className="mb-4">
                WUKONG does not guarantee that the results obtained from the use
                of the service will be accurate or reliable.
              </Typography>
              <ol
                style={{ listStyleType: 'lower-alpha' }}
                className="font-onest mb-4 space-y-1 pl-4 text-sm">
                <li>
                  Customers agree that Our Services are at their own risk, and
                  that WUKONG Services are provided on an “AS IS” and “AS
                  AVAILABLE” basis
                </li>
                <li>
                  Customer agrees to bear any risks, losses or consequences
                  suffered due to, among others: damage, delay, loss or error in
                  sending orders and communications, electronically caused by
                  the Customer
                </li>
                <li>
                  {' '}
                  Account reports or notifications of use of Our Services sent
                  to the Customer are received or read or misused by an
                  unauthorized party over the Account
                </li>
                <li>
                  The Account password is known by another person/party due to
                  the Customer's fault
                </li>
                <li>
                  Customers understand and agree that they will use Account and
                  Our Services for transactions that do not conflict with the
                  provisions of applicable laws and/or WUKONG internal policies
                  and/or other applicable national and international regulations
                  related to the implementation of such transactions, either
                  directly or indirectly
                </li>
                <li>
                  In conducting transactions using WUKONG services, Customers
                  understand and agree that there are certain sanctions imposed
                  by the government, including governments of other countries,
                  and/or other authorized agencies against several countries,
                  bodies and individuals
                </li>
              </ol>
              <ol
                style={{ listStyleType: 'lower-alpha' }}
                className="font-onest mb-4 space-y-1 pl-4 text-sm"></ol>
            </li>

            <li className="mt-6">
              NOTICE
              <ol
                style={{ listStyleType: 'lower-alpha' }}
                className="font-onest mb-4 space-y-1 pl-4 text-sm">
                <li>
                  {' '}
                  Customer agrees to communicate with Us in electronic format,
                  and agrees that all terms, conditions, agreements, notices,
                  disclosures or any other form of communication provided by
                  WUKONG to Customer electronically shall be deemed to be in
                  writing
                </li>
                <li>
                  Customer agrees to receive emails from the Website. Emails
                  sent may contain information about Accounts, transactions,
                  systems, promotions and so on
                </li>
              </ol>
            </li>

            <li className="mt-6">
              APPLICABLE LAWS
              <ol
                style={{ listStyleType: 'decimal' }}
                className="font-onest mb-4 space-y-1 pl-4 text-sm">
                Terms of Use are made, interpreted and enforced based on the
                laws of the Republic of Indonesia Any dispute, controversy or
                difference of opinion (hereinafter referred to as "Dispute")
                arising in connection with the implementation of cooperation
                will be resolved in the following manner:
                <ol
                  style={{ listStyleType: 'lower-alpha' }}
                  className="font-onest mb-4 space-y-1 pl-4 text-sm">
                  <li>
                    That any Dispute, to the extent possible, will be resolved
                    by means of deliberation to reach consensus
                  </li>
                  <li>
                    Any Dispute that cannot be resolved by deliberation will be
                    resolved through the Central Jakarta District Court
                  </li>
                </ol>
              </ol>
            </li>

            <li className="mt-6">
              REPRESENTATIONS AND WARRANTIES
              <ol
                style={{ listStyleType: 'decimal' }}
                className="font-onest mb-4 space-y-1 pl-4 text-sm">
                <li>
                  {' '}
                  All services on the Website do not provide any guarantee or
                  warranty and WUKONG does not guarantee that the Website will
                  always be accessible at all times
                </li>
                <li>
                  Customers state and guarantee that they will use Our Services
                  properly and responsibly and will not take actions that are
                  contrary to the laws, regulations and regulations in force in
                  the territory of the Republic of Indonesia
                </li>
                <li>
                  Customers state and guarantee that they will not use Our
                  Services in the sale of goods and/or services related to:
                </li>
                <ol
                  style={{ listStyleType: 'lower-alpha' }}
                  className="font-onest mb-4 space-y-1 pl-4 text-sm">
                  <li>
                    Narcotics, materials and/or chemicals for research; ii)
                    Money and anything similar to money, including derivatives;
                    iii) Goods and/or services that violate Intellectual
                    Property Rights; iv) Ammunition, firearms, explosives, sharp
                    weapons in accordance with applicable Laws; v) Goods and/or
                    services that show personal information from Third Parties
                    that violate the law
                  </li>
                  <li>Support for Ponzi schemes</li>
                  <li>
                    Goods and/or services related to lottery or lay-away
                    purchases
                  </li>
                  <li>
                    Services related to banking outside the territory of the
                    Republic of Indonesia
                  </li>
                  <li>
                    Services that offer to eliminate or negotiate consumer
                    credit debts/obligations to banks or financing institutions
                  </li>
                  <li>Misuse of card payment services</li>
                  <li>
                    Support for organizations that are prohibited or prohibited
                    by the government
                  </li>
                </ol>
                <li>
                  Customer declares and guarantees not to use Our Services for
                  acts involved in gambling practices and/or other activities
                  that charge an entry fee and promise prizes, including but not
                  limited to casino games, gambling in sports, businesses that
                  facilitate gambling and lottery methods
                </li>
                <li>
                  Customer declares and guarantees that all data, information
                  and documents provided by Customers to Us are true, valid,
                  honest, transparent, complete and accurate data, information
                  and documents
                </li>
                <li>
                  Customer hereby agrees and Customer authorizes Us to use all
                  data, statements and information obtained regarding Customers
                  including but not limited to the use of Customer's personal
                  communication facilities for all other purposes as long as
                  possible and permitted by applicable laws, including those
                  aimed at marketing WUKONG products or other parties, who
                  cooperate with WUKONG
                </li>
                <li>
                  Customer declares and guarantees that transactions carried out
                  using Our Services are transactions that do not violate the
                  provisions of applicable laws and regulations and provisions
                  regarding the acceptance of transaction implementation as
                  stipulated in the Terms of Use
                </li>
              </ol>
            </li>

            <li className="mt-6">
              OTHERS
              <ol
                style={{ listStyleType: 'decimal' }}
                className="font-onest mb-4 space-y-1 pl-4 text-sm">
                <li>
                  For matters not regulated in these Terms of Use, all
                  provisions of the Civil Code and other related laws and
                  regulations shall apply
                </li>
                <li>
                  If We make changes to the contents of these Terms of Use, we
                  will notify the Customer of the changes in accordance with
                  applicable laws and regulations through a notification medium
                  deemed appropriate by WUKONG and the Customer will then be
                  subject to the changes
                </li>
                <li>
                  If the Customer takes actions outside the Terms of Use, the
                  Customer will be fully responsible and hereby agrees that
                  WUKONG will not provide compensation and/or liability in any
                  form to the Customer, or any party for any demands and/or
                  lawsuits and/or claims filed by other parties in connection
                  with the actions taken by the Customer
                </li>
                <li>
                  The Customer is required to comply with all requirements
                  stated in the Terms of Use.
                </li>
              </ol>
            </li>
          </ol>
        </Box>
      </Container>
    </section>
  );
}
