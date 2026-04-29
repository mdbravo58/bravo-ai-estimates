update public.organizations
set name = 'Prime Company',
    logo_url = null
where name ilike '%Tiger%'
   or name ilike '%Martial%'
   or name ilike '%Academy%'
   or logo_url is not null;
